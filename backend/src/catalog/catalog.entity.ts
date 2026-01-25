//catalog.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum CatalogCategory {
  CLOTHES = 'Одежда',
  HOODIES = 'Худи',
  TSHIRTS = 'Футболки',
  PANTS = 'Брюки',
  CARDIGANS = 'Кардиганы',
  ACCESSORIES = 'Аксессуары',
  JEWELRY = 'Украшения',
  HEADWEAR = 'Головные уборы',
  SCARVES = 'Шарфы',
  MITTENS = 'Варежки',
  BAGS = 'Сумки',
}

@Entity()
export class CatalogItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: CatalogCategory,
  })
  category: CatalogCategory;

  @Column('decimal')
  price: number;

  @OneToMany(() => CatalogImage, (image) => image.catalogItem, {
    cascade: true,
    eager: true,
  })
  images: CatalogImage[];
}

@Entity()
export class CatalogImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => CatalogItem, (item) => item.images, { onDelete: 'CASCADE' })
  catalogItem: CatalogItem;
}
