import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { IProjects } from 'src/app/interfaces/iproject';
import { ProjectProvider } from 'src/providers/project.provider';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild('filter', { static: true }) filter!: ElementRef;


  displayedProjects: string[] = [
    'type',
    'name',
    'client',
    'managerEnvoltiProjectManager',
    'icon',
  ];

  filteredProjectList = new MatTableDataSource();
  projects!: IProjects[];
  project!: any;
  projectId!: string;

  constructor(
    private router: Router,
    private projectsProvider: ProjectProvider
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getProjectList();
    this.initFilter();
  }

  initFilter() {
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(debounceTime(200), distinctUntilChanged())

      .subscribe((res) => {
        this.filteredProjectList.data = this.projects.filter(
          (project) =>
          project.name
              .toLocaleLowerCase()
              .includes(this.filter.nativeElement.value.toLocaleLowerCase())
        );
      });
  }

  async selectList(ev: any) {
    if (ev.value == 1) {
      return (this.filteredProjectList = this.projects =
        await this.projectsProvider.findAll());
    }
    // if (ev.value == 2) {
    //   return (this.filteredProjectList = this.projects =
    //     await this.projectsProvider.findActive());
    // }
    // if (ev.value == 3) {
    //   return (this.filteredProjectList = this.projects =
    //     await this.projectsProvider.findInactive());
    // }
  }

  editCollaborator(collaboratorId: any) {
    this.router.navigate([`colaborador/${collaboratorId}`]);
  }

  createProject() {
    this.router.navigate(['projeto/tipo']);
  }

  async getProjectList() {
    this.filteredProjectList.data = this.projects =
      await this.projectsProvider.findAll();
  }

  async editProject(projectSelected: any) {
    this.project = projectSelected;
    sessionStorage.setItem('project_type', this.project.type.toString());
    this.router.navigate(['projeto/alocacao:id']);
  }
}
