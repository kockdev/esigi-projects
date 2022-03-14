/* eslint-disable prettier/prettier */
import { ActivitiesEntity } from 'src/app/activities/activities.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Double, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SpatialScaleType } from './dtos/spatial-scale-type.enum';
import { Status } from './dtos/status.enum';
import { Type } from './dtos/type.enum';

@Entity({ name: 'projects' })
export class ProjectsEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'code', type: 'int', unique: true })
    code: number;

    @Column({ name: 'responsible' })
    responsible: string;

    @Column({ name: 'client' })
    client: string;

    @Column({ name: 'start_date', nullable: true })
    startDate: Date;

    @Column({ name: 'end_date', nullable: true })
    endDate: Date;

    @Column({ name: 'contracted_hours', type: 'datetime' })
    contractedHours: Date;

    @Column({ name: 'value', type: 'double', nullable: true })
    value: Double;

    @Column({ name: "manager_envolti" })
    managerEnvolti: string;

    @Column({ name: 'Type', type: 'int' })
    type: Type;

    @Column({ name: 'spatial_scale', nullable: true })
    spatialScale: boolean;

    @Column({ type: 'int', nullable: true })
    spatialScaleType: SpatialScaleType;

    @Column({ name: 'control_hours', nullable: true })
    controlHours: boolean;

    @Column({ name: 'status', type: 'int', nullable: true })
    status: Status;

    @OneToMany(() => ActivitiesEntity, activities => activities.Project, { cascade: ['insert', 'update', 'remove'], orphanedRowAction: 'delete' })
    activities: ActivitiesEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
    deletedAt: Date;

}
