import {
  getStudentsCrud,
  addStudentCrud,
  deleteStudentCrud,
  editStudentCrud,
  getStudentsCourseCrud,
  addMultipleStudentsCourseCrud,
  deleteMultipleStudentsCourseCrud,
  getStudentCrud,
  getStudentsCourseExamCrud,
  getOneStudentCourseCrud
} from "../cruds/student_cruds";

import Alert from "react-s-alert";
import { parseStudentCourseData } from "./student_function_service";


export async function getStudentsService(token, _schoolYearId) {
  return await getStudentsCrud(token, _schoolYearId).then((result) => {
    if (result.success) {

    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}


export async function getStudentService(token, student_id) {
  return await getStudentCrud(token, student_id).then((result) => {
    if (result.success) {

    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}

export async function getStudentsCourseService(token, course_id, schoolYearId, student_id) {
  return await getStudentsCourseCrud(token, course_id, schoolYearId, student_id).then((result) => {
    if (result.success) {

    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}


export async function getStudentsCourseExamService(token, course_id, schoolYearId, exam_id) { // Trae la nota de los alumnos del curso para un exámen 
  return await getStudentsCourseExamCrud(token, course_id, schoolYearId, exam_id).then((result) => {
    if (result.success) {

    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}





export async function addStudentService(token, data) {
  const parseStudentData = !!data.length ? data : [data];
  return await addStudentCrud(token, parseStudentData).then((result) => {
    if (result.success) {
      Alert.success("Alumno agregado correctamente", {
        effect: "stackslide",
      });
    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      })
    }
    return result;
  })
}

export async function editStudentService(token, data) {
  let parseStudentData = {};
  Object.keys(data).map((key) => {
    if (data[key] === null || data[key] === '32/12/1969') {
      delete data[key]
    } else {
      parseStudentData[key] = data[key];
    }
  })
  return await editStudentCrud(token, parseStudentData).then((result) => {
    if (result.success) {
      Alert.success("Alumno editado correctamente", {
        effect: "stackslide",
      });
    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}

export async function deleteStudentService(token, data) {
  return await deleteStudentCrud(token, data).then((result) => {
    if (result.success) {
      Alert.success("Alumno eliminado correctamente", {
        effect: "stackslide",
      });
    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}


export async function deleteMultipleStudentsCourseService(token, data) {
  const DATA = parseStudentCourseData(data, 'delete');
  return await deleteMultipleStudentsCourseCrud(token, DATA).then((result) => {
    if (result.success) {

    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}

export async function addMultipleStudentsCourseService(token, data) {
  const DATA = parseStudentCourseData(data, 'add');
  return await addMultipleStudentsCourseCrud(token, DATA).then((result) => {
    if (result.success) {
      Alert.success("Se modificaron los alumnos del curso correctamente", {
        effect: "stackslide",
      });
    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}



export async function getOneStudentCourseService(token, student_id) {
  return await getOneStudentCourseCrud(token, student_id).then((result) => {
    if (result.success) {

    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
    }
    return result;
  })
}
