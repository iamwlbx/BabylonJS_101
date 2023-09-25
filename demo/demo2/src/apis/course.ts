import request from '@/utils/request'

// 对data数据的约束
// 前端给后端的数据的类型约束
interface IgetCourse {
  pageNum: number
  pageSize: number
}
// 后端给前端的数据的类型约束

interface IgetResult {
  data: {
    pageInfo: {
      endRow: number
      firstPage: number
      hasNextPage:
      true
      hasPreviousPage:
      false
      isFirstPage:
      true
      isLastPage:
      false
      lastPage: number
      list: {
        bizCourseAttachments: null;
        bizCourseChapters: null;
        bizCourseDetail: null;
        bizCourseTeacher: null;
        clicks: number;
        courseCover: string;
        courseLevel: number;
        courseName: string;
        createBy: string;
        createTime: number;
        discountPrice: number;
        ext1: string;
        ext2: string;
        ext3: string;
        firstCategory: string;
        firstCategoryName: string;
        id: string;
        isIntegral: number;
        isMember: number;
        isRecommend: number;
        lecturerName: null
        purchaseCnt: number;
        purchaseCounter: number;
        salePrice: number;
        saleType: number;
        secondCategory: string;
        secondCategoryName: string;
        status: number;
        tags: string;
        teachingType: number;
        totalHour: number;
        updateBy: string;
        updateTime: number;
      }[]
      navigateFirstPage: number
      navigateLastPage: number
      navigatePages: number
      navigatepageNums: number[]
      nextPage: number
      pageNum: number
      pageSize: number
      pages: number
      prePage: number
      size: number
      startRow: number
      total: number
    }
  }
  meta: {
    code: string
    msg: string
    success: boolean
    timestamp: string
    version: string
  }
}



export function getCourse(data: IgetCourse): Promise<IgetResult> {
  return request('/api/course/mostNew', data);
}