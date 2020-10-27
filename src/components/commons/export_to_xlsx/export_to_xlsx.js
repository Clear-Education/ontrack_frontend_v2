import GetAppIcon from '@material-ui/icons/GetApp';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const ExportToXlsx = ({ fileData, template_name }) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, template_name + fileExtension);
    }

    return (
        <button 
        className="ontrack_btn add_btn" 
        style={{ width: '72%' }}
        onClick={(e) => exportToCSV(fileData)}
        >
            Descargar plantilla <GetAppIcon />
        </button>
    )

}

export default ExportToXlsx;