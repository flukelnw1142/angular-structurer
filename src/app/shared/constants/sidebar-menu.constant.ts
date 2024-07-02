import { SidebarMenu } from '../interfaces/sidebar-menu.interface';

export const MENU_MOBILE: SidebarMenu[] = [
  {
    id: 1,
    menu_th: 'ผู้จ่ายงาน',
    menu_en: 'Dispatcher',
    menu_detail: 'มอบหมายงานที่ต้องทำบนรถโดยสารและเวลาเฉพาะให้แก่พนักงานขับรถและพนักงานเก็บค่าโดยสารบนรถโดยสาร สามารถเข้าสู่ระบบและสร้าง/แก้ไขการมอบหมายงานสำหรับเส้นทางรถเมล์และกะที่รับผิดชอบได้ สามารถเลือกพนักงานขับรถ/พนักงานเก็บค่าโดยสารที่พร้อมใช้งานและตรงกับกะที่กำหนดได้ สามารถกรองตามเส้นทาง/กะและเลือกพนักงานขับรถ/พนักงานเก็บค่าโดยสารได้ สามารถเลือกรถเมล์ที่พร้อมใช้งานตามเส้นทาง/กะที่กำหนดได้',
    icon: 'pi-chart-bar',
    router: '/dashboard',
    code: 'DISPATCHER'
  },
  {
    id: 2,
    menu_th: 'พนักงานขับรถ',
    menu_en: 'Bus Driver',
    menu_detail: 'รับผิดชอบในการขับรถเมล์บนเส้นทางที่กำหนด สามารถเข้าสู่ระบบและดูข้อมูลรถเมล์และเส้นทางที่ได้รับมอบหมายได้ สามารถเห็นเวลาออกจากแต่ละจุดจุดจราจรได้ สามารถดูงานที่ได้รับมอบหมายตามสถานะและตัวกรองได้ สามารถดูรายละเอียดงานที่ได้รับมอบหมายเช่น เวลาทำงาน, ชื่อพนักงานขับรถ/พนักงานเก็บค่าโดยสาร, หมายเลขตั๋ว, และจุดจราจรได้',
    icon: 'pi-th-large',
    router: '/bus-depot',
    code: 'DRIVER'
  },
  {
    id: 2,
    menu_th: 'พนักงานเก็บค่าโดยสาร',
    menu_en: 'Bus Driver',
    menu_detail: 'รับผิดชอบในการขับรถเมล์บนเส้นทางที่กำหนด สามารถเข้าสู่ระบบและดูข้อมูลรถเมล์และเส้นทางที่ได้รับมอบหมายได้ สามารถเห็นเวลาออกจากแต่ละจุดจุดจราจรได้ สามารถดูงานที่ได้รับมอบหมายตามสถานะและตัวกรองได้ สามารถดูรายละเอียดงานที่ได้รับมอบหมายเช่น เวลาทำงาน, ชื่อพนักงานขับรถ/พนักงานเก็บค่าโดยสาร, หมายเลขตั๋ว, และจุดจราจรได้',
    icon: 'pi-th-large',
    router: '/bus-depot',
    code: 'FARECOLLECT'
  },
  {
    id: 2,
    menu_th: 'นายท่า',
    menu_en: 'Bus Station Master',
    menu_detail: 'จัดการท่ารถเมล์และให้การจัดเวลาการออกของรถโดยสารให้เหมาะสมสำหรับผู้โดยสาร รับผิดชอบในการประสานการออกของรถโดยสารและพิจารณาประเด็นการเดินรถและสภาพพาหนะที่พร้อมใช้งาน สามารถเข้าสู่ระบบและดูงานที่ได้รับมอบหมายที่เกี่ยวข้องกับท่ารถที่รับผิดชอบได้ สามารถบันทึกเวลาออกของรถที่ท่ารถที่เป็นความรับผิดชอบได้',
    icon: 'pi-building',
    router: '/bus-division',
    code: 'TERMINALAGENT'
  },
  {
    id: 4,
    menu_th: 'ผู้จัดการสาย',
    menu_en: 'Route Manager',
    menu_detail: 'จัดการเส้นทางรถเมล์เฉพาะ รับผิดชอบในการอนุมัติงานที่เสร็จสมบูรณ์หลังจากที่นายท่ายืนยันได้ สามารถเข้าสู่ระบบและดูงานที่ได้รับมอบหมายสำหรับเส้นทางที่ได้รับมอบหมายได้ สามารถอนุมัติงานที่เสร็จสมบูรณ์และดูรายละเอียดเช่น ชั่วโมงทำงาน, ชื่อพนักงานขับรถ/พนักงานเก็บค่าโดยสาร, หมายเลขตั๋ว, และจุดจราจรได้',
    icon: 'pi-sliders-v',
    router: '/bus-type',
    code: 'BUSLINESMANAGER'
  },
];

export const MENU_WEB: SidebarMenu[] = [
  {
    id: 1,
    menu_th: 'หน้าหลัก',
    menu_en: 'Home',
    menu_detail: 'แสดงสถิติการเก็บเงินค่าบัตรโดยสารและจำนวนบัตรโดยสารในแต่ละเดือน',
    icon: 'pi-chart-bar',
    router: '/dashboard',
    code: 'HOME'
  },
  {
    id: 2,
    menu_th: 'อู่รถเมล์',
    menu_en: 'Bus Depot',
    menu_detail: 'จัดการข้อมูลที่เกี่ยวข้องกับอู่รถเมล์',
    icon: 'pi-th-large',
    router: '/bus-depot',
    code: 'BUS_DEPOT'
  },
  {
    id: 3,
    menu_th: 'กองปฏิบัติการเดินรถ',
    menu_en: 'Bus Division',
    menu_detail: 'จัดการข้อมูลที่เกี่ยวข้องกับกองปฏิบัติการเดินรถ',
    icon: 'pi-building',
    router: '/bus-division',
    code: 'BUS_DIVISION'
  },

  {
    id: 4,
    menu_th: 'ราคาตั๋วรถเมล์',
    menu_en: 'Fare',
    menu_detail: 'จัดการข้อมูลราคาตั๋วรถเมล์',
    icon: 'pi-money-bill',
    router: '/fare',
    code: 'FARE'
  },
  {
    id: 5,
    menu_th: 'ประเภทรถเมล์',
    menu_en: 'Bus Type',
    menu_detail: 'จัดการข้อมูลประเภทต่าง ๆ ของรถเมล์',
    icon: 'pi-sliders-v',
    router: '/bus-type',
    code: 'BUS_TYPE'
  },
  {
    id: 6,
    menu_th: 'ท่ารถเมล์',
    menu_en: 'Bus Terminal',
    menu_detail: 'จัดการข้อมูลท่ารถเมล์',
    icon: 'pi-truck',
    router: '/bus-terminal',
    code: 'BUS_TERMINAL'
  },
  {
    id: 7,
    menu_th: 'สายรถเมล์',
    menu_en: 'Bus Lines',
    menu_detail: 'จัดการข้อมูลสายรถเมล์และเส้นทาง',
    icon: 'pi-sitemap',
    router: '/bus-lines',
    code: 'BUS_LINES'
  },

  {
    id: 8,
    menu_th: 'รายการรถเมล์',
    menu_en: 'Bus Vehicle',
    menu_detail: 'จัดการข้อมูลรถเมล์และการตรวจสอบสถานะ',
    icon: 'pi-car',
    router: '/bus-vehicle',
    code: 'BUS_VEHICLE'
  },
  {
    id: 9,
    menu_th: 'ผู้ใช้งาน',
    menu_en: 'Users',
    menu_detail: 'จัดการข้อมูลผู้ใช้งานและสิทธิ์',
    icon: 'pi-users',
    router: '/user',
    code: 'USERS'
  },
  {
    id: 10,
    menu_th: 'สิทธ์การใช้งาน',
    menu_en: 'Roles',
    menu_detail: 'จัดการสิทธิ์การใช้งานและการกำหนดบทบาท',
    icon: 'pi-verified',
    router: '/role',
    code: 'ROLES'
  }
];

