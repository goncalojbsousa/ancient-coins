import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Coin } from '../../models/coin.model';
import { EditCoinModalComponent } from './edit-coin-modal.component';

describe('EditCoinModalComponent', () => {
  let component: EditCoinModalComponent;
  let fixture: ComponentFixture<EditCoinModalComponent>;
  const coin: Coin = {
    id: 1,
    owner_id: 1,
    name: 'Denário Romano',
    origin: 'Roma',
    year: '312',
    material: 'Prata',
    condition: 'Bom',
    description: 'Moeda romana em bom estado.',
    photos: [],
    available_for_sale: false,
    available_for_trade: false,
    price: null,
    trade_preference: null,
    created_at: '2026-06-04T00:00:00.000Z',
    updated_at: '2026-06-04T00:00:00.000Z',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditCoinModalComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCoinModalComponent);
    component = fixture.componentInstance;
    component.coin = coin;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
