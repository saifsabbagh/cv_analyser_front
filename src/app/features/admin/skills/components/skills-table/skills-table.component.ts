import { Component, effect, input, output, signal } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { Skill } from '../../../../../core/models/skill.model';

@Component({
  selector: 'app-skills-table',
  standalone: true,
  imports: [DxDataGridModule, DxTemplateModule],
  templateUrl: './skills-table.component.html',
  styleUrl: './skills-table.component.scss'
})
export class SkillsTableComponent {
  skills = input.required<Skill[]>();
  total = input(0);
  page = input(1);
  limit = input(10);
  loading = input(false);

  rename = output<{ id: number; name: string }>();
  remove = output<number>();
  pageChange = output<{ page: number; limit: number }>();

  protected editingSkillId = signal<number | null>(null);

  // Le grid ne détient que la page serveur courante : le store annonce le
  // total réel pour que le pager calcule le bon nombre de pages.
  protected readonly dataSource = new DataSource({
    store: new CustomStore({
      key: 'id',
      load: () => Promise.resolve({ data: this.skills(), totalCount: this.total() })
    }),
    paginate: true
  });

  constructor() {
    effect(() => {
      this.skills();
      this.total();
      this.dataSource.reload();
    });
  }

  protected onOptionChanged(e: { fullName: string; value?: unknown }): void {
    if (typeof e.value !== 'number') return;

    if (e.fullName === 'paging.pageIndex') {
      this.pageChange.emit({ page: e.value + 1, limit: this.limit() });
    } else if (e.fullName === 'paging.pageSize') {
      this.pageChange.emit({ page: 1, limit: e.value });
    }
  }

  protected getJobUsage(skill: Skill): number {
    return skill._count?.jobSkills ?? 0;
  }

  protected getCvUsage(skill: Skill): number {
    return skill._count?.cvSkills ?? 0;
  }

  // Même règle que le 409 de deleteSkill côté backend.
  protected isDeletable(skill: Skill): boolean {
    return this.getJobUsage(skill) === 0 && this.getCvUsage(skill) === 0;
  }

  protected startEdit(skillId: number): void {
    this.editingSkillId.set(skillId);
  }

  protected cancelEdit(): void {
    this.editingSkillId.set(null);
  }

  protected confirmEdit(skill: Skill, value: string): void {
    const name = value.trim();
    this.editingSkillId.set(null);
    if (name && name.toLowerCase() !== skill.name.toLowerCase()) {
      this.rename.emit({ id: skill.id, name });
    }
  }

  protected onDelete(skill: Skill): void {
    if (!this.isDeletable(skill)) return;
    this.remove.emit(skill.id);
  }
}
