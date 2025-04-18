import courses from './cousre.json';
import courseData from './coursecenter.json';
export default {
  getCourseInfo(id) {
    return new Promise((resolve) => {
      const course = courses.find(course => course.id === parseInt(id));
      resolve({ code: 20000, data: { course } });
    });
  },
  getCourseCenterData() {
    return new Promise((resolve) => {
      resolve({ code: 20000, data: courseData });
    });
  }
};