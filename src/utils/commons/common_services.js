export const convertDate = (inputFormat) => {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat); 
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

export const convertDate2 = (date) => {
    let datearray = date?.split("-");
    let newdate;
    if(datearray){
       newdate = datearray[0] + '/' + datearray[1] + '/' + datearray[2];
    }
   
    return newdate;
}

export const convertDate3 = (inputFormat) => {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1),d.getFullYear()].join("-");
}



export const fromStoreToDateInputFormatDate = (date) =>{
    let datearray = date?.split("-");
    const year = +datearray[0];
    const month = datearray[1]-1;
    const day = +datearray[2]
    let newDate = new Date(year,month,day);
    return newDate;
}

export const fromStoreToViewFormatDate = (date) =>{
    let datearray = date?.split("-");
    let newdate;
    if(datearray){
        const year = +datearray[0];
        const month = datearray[1];
        const day = +datearray[2]
        newdate = `${day}/${month}/${year}`
    }
    return newDate;
}


export const convertDateToSend = (date) =>{
    let formatDate = new Date(date);
    const year = formatDate.getFullYear();
    const month = formatDate.getMonth()+1;
    const day = formatDate.getDate();
    let newDate = `${day}/${month}/${year}`;
    return newDate;
}

export const convertDateFromStoreToSend = (date) => {
    let datearray = date?.split("-");
    let newdate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
    return newdate;
}