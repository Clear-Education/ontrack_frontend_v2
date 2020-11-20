import * as XLXS from 'xlsx';

export const convertDate = (inputFormat) => {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

export const convertDate2 = (date) => {
    let datearray = date?.split("-");
    let newdate = '';
    if (datearray) {
        newdate = datearray[0] + '/' + datearray[1] + '/' + datearray[2];
    }
    return newdate;
}

export const convertDate3 = (inputFormat) => {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("-");
}

export const fromStoreToDateInputFormatDate = (date) => {
    let datearray = date?.split("-");
    const year = +datearray[0];
    const month = datearray[1] - 1;
    const day = +datearray[2]
    let newDate = new Date(year, month, day);
    return newDate;
}


export const fromApiToDateInputFormatDate = (date) => {
    if(date){
        let datearray = date?.split("/");
        const day = +datearray[0];
        const month = datearray[1] - 1;
        const year = +datearray[2]
        let newDate = new Date(year, month, day);
        return newDate;
    }
}

export const fromStoreToViewFormatDate = (date) => {
    let datearray = date?.split("-");
    let formatDate = '10/10/1997';
    if (!!datearray?.length) {
        const year = +datearray[0];
        const month = datearray[1];
        const day = +datearray[2]
        formatDate = `${day}/${month}/${year}`
    }
    return formatDate;
}


export const convertDateToSend = (date) => {
    let formatDate = new Date(date);
    const year = formatDate.getFullYear();
    const month = formatDate.getMonth() + 1;
    const day = formatDate.getDate();
    let newDate = `${day}/${month}/${year}`;
    return newDate;
}

export const convertDateToSendOnQuery = (date) => {
    let formatDate = new Date(date);
    const year = formatDate.getFullYear();
    const month = formatDate.getMonth() + 1;
    const day = formatDate.getDate();
    let newDate = `${day}-${month}-${year}`;
    return newDate;
}

export const convertDateFromStoreToSend = (date) => {
    let datearray = date?.split("-");
    let newdate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
    return newdate;
}


export const parseCalendarDates = (date) => {
    let formatDate = new Date(date);
    const year = formatDate.getFullYear();
    const month = formatDate.getMonth() + 1;
    const day = formatDate.getDate() + 1;
    let newDate = `${year}-${month}-${day}`;
    return newDate;
}

export const convertFormatToDatePicker = (date) => {
    let datearray = date?.split("-");
    let formatDate = '10/10/1997';
    if (!!datearray?.length) {
        const year = +datearray[0];
        const month = datearray[1];
        const day = +datearray[2];
        formatDate = `${month}-${day}-${year}`
        return formatDate;
    }
}

export const parseCsvToJson = (file, handleOnLoad) => {
    let fileData = [];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLXS.read(data, { type: 'array' });
        workbook.SheetNames.forEach((sheetname) => {
            const sheet = workbook.Sheets[sheetname];
            var XL_row_object = XLXS.utils.sheet_to_json(sheet);
            fileData = [...XL_row_object].filter((student) => { return student.puntaje !== 0 });
            handleOnLoad(fileData);
        })
    }
}


export const parseStudentsCsvToJson = (file, handleOnLoad) => {
    let fileData = [];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLXS.read(data, { type: 'array' });
        workbook.SheetNames.forEach((sheetname) => {
            const sheet = workbook.Sheets[sheetname];
            var XL_row_object = XLXS.utils.sheet_to_json(sheet);
            fileData = [...XL_row_object];
            handleOnLoad(fileData);
        })
    }
}

export const parseStudentsDataToExport = (students) => {
    let newStudentData = [];
    students.map((student) => {
        let newStudent = {
            id: student.id,
            nombre: student.nombre,
            apellido: student.apellido,
            legajo: student.legajo,
            puntaje: student.puntaje
        }
        newStudentData.push(newStudent);
    });
    return newStudentData;
}