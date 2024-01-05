import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { groupProcedure } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrl: './quick-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickSearchComponent implements OnInit {
  groups = [
    {
      value: null,
      label: '-',
    },
    {
      value: groupProcedure.EXTERNAL,
      label: 'Tramites: EXTERNOS',
    },
    {
      value: groupProcedure.INTERNAL,
      label: 'Tramites: INTERNOS',
    },
  ];
  public FormSearch = this.fb.group({
    code: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]*$')]],
    group: [''],
  });
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {}
}
