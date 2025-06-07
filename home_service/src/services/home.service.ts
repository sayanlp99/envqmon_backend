import { Home } from '../models/home.model';

export const createHome = (data: any) => Home.create(data);
export const getAllHomes = () => Home.findAll();
export const getHomeById = (id: string) => Home.findByPk(id);
export const updateHome = (id: string, data: any) => Home.update(data, { where: { home_id: id } });
export const deleteHome = (id: string) => Home.destroy({ where: { home_id: id } });
