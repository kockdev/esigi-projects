/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Like,
  Repository,
  In,
} from 'typeorm';
import { NotFoundException } from '../exceptions/not-found-exception';
import { CreateProjectDto } from './dtos/create-projects.dto';
import { UpdateProjectDto } from './dtos/update-projects.dto';
import { ProjectsEntity } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
    private httpService: HttpService,
  ) {
    projectsRepository: {
      useSoftDelete: true;
    }
  }

  async findAll() {
    const options: FindManyOptions = {
      order: { createdAt: 'DESC' },
    };
    try {
      let teste = [];
      const projects = await this.projectsRepository.find(options);

      const collaboratorIdList = projects.map((project) => {
        let obj = { id: project.collaboratorRequesterId };
        teste = [obj];
        return project.collaboratorRequesterId;
      });

      const collaborators = await this.httpService
        .post('http://localhost:3501/api/v1/collaborators/list', {
          idList: collaboratorIdList,
        })
        .toPromise();

      if (collaborators.data) {
        projects.map((project) => {
          if (project.collaboratorRequesterId != undefined) {
            const collaborator = collaborators.data.find(
              (collaborator) =>
                collaborator.id === project.collaboratorRequesterId,
            );
            if (collaborator) {
              project.collaborator = {
                firstNameCorporateName: collaborator.firstNameCorporateName,
                lastNameFantasyName: collaborator.lastNameFantasyName,
              };
            } else {
              project.collaboratorRequesterId = null;
            }

            return project;
          } else {
            return project;
          }
        });
      } else {
        return projects;
      }

      const customerIdList = projects.map((project) => {
        return project.customerId;
      });

      const customers = await this.httpService
        .post('http://localhost:3506/api/v1/customers/list', {
          idList: customerIdList,
        })
        .toPromise();
      if (customers.data) {
        projects.map((project) => {
          if (project.customerId != undefined) {
            const customer = customers.data.find(
              (customer) => customer.id == project.customerId,
            );
            if (customer) {
              project.customer = {
                corporateName: customer.corporateName,
              };
            } else {
              project.customerId = null;
            }

            return project;
          } else {
            return project;
          }
        });
      } else {
        return projects;
      }
      return projects;
    } catch (err) {
      console.log(err);
      throw new NotFoundException();
    }
  }

  async findProjectsListById(idList: string[]) {
    return await this.projectsRepository.find({
      select: ['id', 'name', 'code', 'status'],
      where: { id: In(idList) },
    });
  }

  async findByCollaborator(id: string) {
    try {
      const projects = await this.projectsRepository.query(
        'select projects_entity.name, r.paper, a.start_date, a.end_date, r.estimated_hours, projects_entity.collaborator_requester_id, projects_entity.customer_id from projects_entity left join  activities_entity a on a.project_id = projects_entity.id left join  resources_entity r on r.activity_id = a.id where r.collaborator_id = ' +
          '"' +
          id +
          '"',
      );

      const managerIdList = projects.map((project) => {
        return project.collaborator_requester_id;
      });

      const managers = await this.httpService
        .post('http://localhost:3501/api/v1/collaborators/list', {
          idList: managerIdList,
        })
        .toPromise();

      if (managers.data) {
        projects.map((project) => {
          if (project.collaborator_requester_id != undefined) {
            const manager = managers.data.find(
              (manager) => manager.id === project.collaborator_requester_id,
            );
            if (manager) {
              project.collaborator = {
                firstNameCorporateName: manager.firstNameCorporateName,
                lastNameFantasyName: manager.lastNameFantasyName,
              };
            } else {
              project.collaborator_requester_id = null;
            }
            return project;
          } else {
            return project;
          }
        });
      } else {
        return projects;
      }

      const customerIdList = projects.map((project) => {
        return project.customer_id;
      });

      const customers = await this.httpService
        .post('http://localhost:3506/api/v1/customers/list', {
          idList: customerIdList,
        })
        .toPromise();

      if (customers.data) {
        projects.map((project) => {
          if (project.customer_id != undefined) {
            const customer = customers.data.find(
              (customer) => customer.id == project.customer_id,
            );
            if (customer) {
              project.customer = {
                corporateName: customer.corporateName,
              };
            } else {
              project.customer_id = null;
            }

            return project;
          } else {
            return project;
          }
        });
      } else {
        return projects;
      }
      console.log(projects);
      return projects;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async requestResource(projects: any[]) {
    try {
      const managerIdList = projects.map((project) => {
        return project.collaboratorRequesterId;
      });

      const managers = await this.httpService
        .post('http://localhost:3501/api/v1/collaborators/list', {
          idList: managerIdList,
        })
        .toPromise();

      if (managers.data) {
        projects.map((project) => {
          if (project.collaboratorRequesterId != undefined) {
            const manager = managers.data.find(
              (manager) => manager.id === project.collaboratorRequesterId,
            );
            if (manager) {
              project.collaborator = {
                firstNameCorporateName: manager.firstNameCorporateName,
                lastNameFantasyName: manager.lastNameFantasyName,
              };
            } else {
              project.collaborator_requester_id = null;
            }
            return project;
          } else {
            return project;
          }
        });
      } else {
        return projects;
      }

      const customerIdList = projects.map((project) => {
        return project.customerId;
      });

      const customers = await this.httpService
        .post('http://localhost:3506/api/v1/customers/list', {
          idList: customerIdList,
        })
        .toPromise();

      if (customers.data) {
        projects.map((project) => {
          if (project.customerId != undefined) {
            const customer = customers.data.find(
              (customer) => customer.id == project.customerId,
            );
            if (customer) {
              project.customer = {
                corporateName: customer.corporateName,
              };
            } else {
              project.customerId = null;
            }

            return project;
          } else {
            return project;
          }
        });
      } else {
        return projects;
      }
      return projects;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async findOneOrFaill(
    conditions: FindConditions<ProjectsEntity>,
    options?: FindOneOptions<ProjectsEntity>,
  ) {
    options = { relations: ['activities'] };
    try {
      return await this.projectsRepository.findOneOrFail(conditions, options);
    } catch {
      throw new NotFoundException();
    }
  }

  async findInPreparation() {
    let project = await this.projectsRepository
      .createQueryBuilder('projects')
      .where('projects.status =1')
      .getMany();
    return await this.requestResource(project);
  }

  async findSent() {
    let project = await this.projectsRepository
      .createQueryBuilder('projects')
      .where('projects.status =2')
      .getMany();
    return await this.requestResource(project);
  }

  async findStop() {
    let project = await this.projectsRepository
      .createQueryBuilder('projects')
      .where('projects.status =3')
      .getMany();
    return await this.requestResource(project);
  }

  async findDeclined() {
    let project = await this.projectsRepository
      .createQueryBuilder('projects')
      .where('projects.status =4')
      .getMany();
    return await this.requestResource(project);
  }

  async findNewProposal() {
    let project = await this.projectsRepository
      .createQueryBuilder('projects')
      .where('projects.status =5')
      .getMany();
    return await this.requestResource(project);
  }

  async findProject(name: string, status: number) {
    let project;
    if (name === '') {
      switch (status) {
        case 1:
          project = this.findAll();
          return project;
          break;
        case 2:
          project = this.findInPreparation();
          return project;
          break;
        case 3:
          project = this.findSent();
          return project;
          break;
        case 4:
          project = this.findStop();
          return project;
          break;
        case 5:
          project = this.findDeclined();
          return project;
          break;
        case 6:
          project = this.findNewProposal();
          return project;
          break;
      }
    } else {
      switch (status) {
        case 1:
          project = await this.projectsRepository.find({
            select: [
              'id',
              'name',
              'code',
              'customerId',
              'status',
              'collaboratorRequesterId',
              'startDate',
            ],
            where: [
              {
                name: Like(`%${name}%`),
              },
            ],
          });

          return await this.requestResource(project);

          break;
        case 2:
          project = await this.projectsRepository.find({
            select: [
              'id',
              'name',
              'code',
              'customerId',
              'status',
              'collaboratorRequesterId',
              'startDate',
            ],
            where: [
              {
                name: Like(`%${name}%`),
                status: 1,
              },
            ],
          });
          return await this.requestResource(project);
          break;
        case 3:
          project = await this.projectsRepository.find({
            select: [
              'id',
              'name',
              'code',
              'customerId',
              'status',
              'collaboratorRequesterId',
              'startDate',
            ],
            where: [
              {
                name: Like(`%${name}%`),
                status: 2,
              },
            ],
          });
          return await this.requestResource(project);
          break;
        case 4:
          project = await this.projectsRepository.find({
            select: [
              'id',
              'name',
              'code',
              'customerId',
              'status',
              'collaboratorRequesterId',
              'startDate',
            ],
            where: [
              {
                name: Like(`%${name}%`),
                status: 3,
              },
            ],
          });
          return await this.requestResource(project);
          break;
        case 5:
          project = await this.projectsRepository.find({
            select: [
              'id',
              'name',
              'code',
              'customerId',
              'status',
              'collaboratorRequesterId',
              'startDate',
            ],
            where: [
              {
                name: Like(`%${name}%`),
                status: 4,
              },
            ],
          });
          return await this.requestResource(project);
          break;
        case 6:
          project = await this.projectsRepository.find({
            select: [
              'id',
              'name',
              'code',
              'customerId',
              'status',
              'collaboratorRequesterId',
              'startDate',
            ],
            where: [
              {
                name: Like(`%${name}%`),
                status: 5,
              },
            ],
          });
          return await this.requestResource(project);
          break;
      }
    }
  }

  async store(data: CreateProjectDto) {
    const project = this.projectsRepository.create(data);
    return await this.projectsRepository.save(project);
  }

  async update(id: string, data: UpdateProjectDto) {
    try {
      await this.projectsRepository.findOneOrFail({ id });
    } catch {
      throw new NotFoundException();
    }
    return await this.projectsRepository.save({ id: id, ...data });
  }

  async destroy(id: string) {
    try {
      await this.projectsRepository.findOneOrFail({ id });
    } catch {
      throw new NotFoundException();
    }

    return await this.projectsRepository.softDelete({ id });
  }
}
