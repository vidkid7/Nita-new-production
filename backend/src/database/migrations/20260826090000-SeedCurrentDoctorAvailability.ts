import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

type AvailabilityWindow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const SCHEDULES: Record<string, AvailabilityWindow[]> = {
  // Published clinic notice: morning 7–8 AM, evening 4–7 PM, Saturday 11 AM–2 PM.
  'rupa.bajagain@nitaclinics.com': [
    ...[1, 2, 3, 4, 5].flatMap((dayOfWeek) => [
      { dayOfWeek, startTime: '07:00', endTime: '08:00' },
      { dayOfWeek, startTime: '16:00', endTime: '19:00' },
    ]),
    { dayOfWeek: 6, startTime: '11:00', endTime: '14:00' },
  ],
  // Published clinic notice: evening 6–7 PM, with an extended Friday 1–7 PM clinic.
  'sudeep.kc@nitaclinics.com': [
    ...[1, 2, 3, 4].map((dayOfWeek) => ({ dayOfWeek, startTime: '18:00', endTime: '19:00' })),
    { dayOfWeek: 5, startTime: '13:00', endTime: '19:00' },
  ],
};

export class SeedCurrentDoctorAvailability20260826090000 implements MigrationInterface {
  name = 'SeedCurrentDoctorAvailability20260826090000';

  private table(queryRunner: QueryRunner, tableName: string): string {
    const schema = String((queryRunner.connection.options as { schema?: string }).schema || 'public').replace(/"/g, '""');
    return `"${schema}"."${tableName}"`;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const doctorsTable = this.table(queryRunner, 'doctors');
    const availabilityTable = this.table(queryRunner, 'doctor_availabilities');
    const emails = Object.keys(SCHEDULES);
    const placeholders = emails.map((_, index) => `$${index + 1}`).join(', ');
    const doctors = await queryRunner.query(
      `SELECT id, email FROM ${doctorsTable} WHERE LOWER(email) IN (${placeholders})`,
      emails,
    );

    for (const doctor of doctors as Array<{ id: string; email: string }>) {
      const email = String(doctor.email).trim().toLowerCase();
      const windows = SCHEDULES[email];
      if (!windows) continue;

      // These published schedules replace stale/default windows for the two
      // doctors, while leaving every other doctor's configuration intact.
      await queryRunner.query(`DELETE FROM ${availabilityTable} WHERE doctor_id = $1`, [doctor.id]);

      for (const window of windows) {
        await queryRunner.query(
          `INSERT INTO ${availabilityTable}
            (id, doctor_id, day_of_week, start_time, end_time, slot_duration, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW(), NOW())`,
          [randomUUID(), doctor.id, window.dayOfWeek, window.startTime, window.endTime, 30],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const doctorsTable = this.table(queryRunner, 'doctors');
    const availabilityTable = this.table(queryRunner, 'doctor_availabilities');
    const emails = Object.keys(SCHEDULES);
    const placeholders = emails.map((_, index) => `$${index + 1}`).join(', ');
    const doctors = await queryRunner.query(
      `SELECT id FROM ${doctorsTable} WHERE LOWER(email) IN (${placeholders})`,
      emails,
    );

    for (const doctor of doctors as Array<{ id: string }>) {
      await queryRunner.query(`DELETE FROM ${availabilityTable} WHERE doctor_id = $1`, [doctor.id]);
    }
  }
}
