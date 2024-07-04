import { SidebarMenu } from '../interfaces/sidebar-menu.interface';

export const MENU_WEB: SidebarMenu[] = [
  {
    id: 1,
    menu_th: 'หน้าหลัก',
    menu_en: 'Home',
    menu_detail: 'รายการที่ดำเนินการอยู่หรือดำเนินการเรียบร้อยแล้ว',
    icon: 'pi-chart-bar',
    router: '/dashboard',
    code : 'HOME'

  },
  {
    id: 2,
    menu_th: 'Customer',
    menu_en: 'Customer',
    menu_detail: 'จัดการข้อมูล Customer',
    icon: 'pi-th-large',
    router: '/customer',
    code: 'BUS_DIVISION'

  },
  {
    id: 3,
    menu_th: 'Supplier',
    menu_en: 'Supplier',
    menu_detail: 'จัดการข้อมูล Supplier',
    icon: 'pi-building',
    router: '/supplier',
    code: 'BUS_DIVISION'
  },
  {
    id: 4,
    menu_th: 'ผู้ใช้งาน',
    menu_en: 'Users',
    menu_detail: 'จัดการข้อมูลผู้ใช้งานและสิทธิ์',
    icon: 'pi-users',
    router: '/user',
    code : 'USERS'
  },
  {
    id: 5,
    menu_th: 'สิทธ์การใช้งาน',
    menu_en: 'Roles',
    menu_detail: 'จัดการสิทธิ์การใช้งานและการกำหนดบทบาท',
    icon: 'pi-verified',
    router: '/role',
    code : 'ROLES'
  }
];

