import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import MTConfig from "../../../utils/table_options/MT_config";
import { Colums } from "../table_colums/table_colums";
import { useEffect, useState } from "react";

const ConfigTable = ({tableName, data}) => {

    const [colums,setColums] = useState();

    const theme = createMuiTheme({
        palette: {
            primary: {
                main: '#004d67',
            },
            secondary: {
                main: '#004d67',
            },
        },

    });

    useEffect(() => {
        const STUDENT_ACTION_COLUM = {
            name: "actions",
            label: "Acciones",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div style={{ display: 'flex' }}>
                            <button onClick={()=>{console.log(tableMeta.rowData)}}>alert</button>
                        </div>
                    )
                },
            },
        }

        const PARTICIPANT_ACTION_COLUM = {
            name: "actions",
            label: "Acciones",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div style={{ display: 'flex' }}>
                            <button onClick={()=>{console.log(tableMeta.rowData)}}>alert</button>
                        </div>
                    )
                },
            },
        }

        let columsCopy = tableName === 'Alumnos' ? [...Colums.students] : tableName === 'Materias' ? [...Colums.subjects] : [...Colums.participants];
        setColums(columsCopy);
    }, [])

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable
                title={`${tableName}`}
                data={data}
                options={MTConfig(`${tableName}`).options}
                components={MTConfig().components}
                localization={MTConfig().localization}
                columns={colums}
            />
        </MuiThemeProvider>
    )

}

export default ConfigTable;