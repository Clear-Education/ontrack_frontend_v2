import { Col, Row } from "react-bootstrap"
import MUIDataTable from "mui-datatables"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from './styles.module.scss';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import MTConfig from "../../../../../../src/utils/table_options/MT_config";
import { getTrackingRolesService } from "../../../../../../src/utils/tracking/services/tracking_services";
import { getUserService } from "../../../../../../src/utils/user/service/user_services";


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#004d67',
        },
        secondary: {
            main: '#e4710fba',
        },
    },

});

const ParticipantsTable = ({ handleGlobalState, currentParticipants }) => {

    const [userData, setUserData] = useState();
    const [selectedUsers, setSelectedUsers] = useState([])
    const user = useSelector((store) => store.user);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getTrackingRolesService(user.user.token).then((result) => {
            let rolEncargado = result.result.results.filter(rol => rol.nombre == "Encargado");
            let selectedUserList = [];
            currentParticipants.map((participant) => {
                if (participant.rol?.toUpperCase() === 'ENCARGADO') {
                    let encargado = {
                        name: participant.usuario.name,
                        last_name: participant.usuario.last_name,
                        id: participant.usuario.id,
                        role: rolEncargado[0].id,
                        role_name: 'ENCARGADO',
                        integrante_id: participant.id,
                    }
                    selectedUserList.push(encargado);
                }
            })
            setSelectedUsers(selectedUserList);
        })
    }, [])


    useEffect(() => {
        setIsLoading(true);
        let currentParticipantsIds = currentParticipants.filter((participant)=>{
            return participant.rol.toUpperCase() === 'ENCARGADO';
        }).map((participant)=>{
            return participant.usuario.id
        });
        getUserService(user.user.token).then((result) => {
            let userFilter = result.result.results.filter(usuario => {
                return  (currentParticipantsIds.indexOf(usuario.id) < 0)
                        && (usuario.groups.name == "Pedagogía" 
                        || usuario.groups.name == "Docente")
            });
            setIsLoading(false);
            setUserData(userFilter);
        })
    }, []);

    const getSelectedUsers = (users) => {
        const filterList = [...userData];
        let users_data = [];
        users.forEach(user => {
            let user_position = user.dataIndex;
            let selected_user = filterList.find((s, index) => index === user_position);
            users_data.push(selected_user);
        });
        return users_data;
    }

    const handleSelectUsers = (users) => {
        if (!!users.length) {
            const usersList = getSelectedUsers(users);
            let selectedUsersCopy = [...selectedUsers];
            usersList.map((user) => {
                if (!!selectedUsersCopy.length) {
                    let indexOf = -1;
                    selectedUsersCopy.map((selectedUser, index) => {
                        if (selectedUser.id === user.id) {
                            indexOf = index
                        }
                    });

                    if (indexOf === -1) {
                        selectedUsersCopy.push(user);
                    } else {
                        selectedUsersCopy.splice(indexOf, 1);
                    }

                } else {
                    selectedUsersCopy.push(user);
                }
            })
            setSelectedUsers(selectedUsersCopy);
        } else {
            setSelectedUsers([]);
        }
    }

    useEffect(() => {
        handleGlobalState('integrantes', selectedUsers);
    }, [selectedUsers]);

    return (
        <Row style={{ margin: 0, justifyContent: 'center', marginBottom: '20px' }}>
            {
                isLoading ?
                    <span style={{ display: 'block', width: '100%', margin: '20px 0px 20px 0px' }}>Cargando...</span> :
                    <>
                        <div className={styles.message_alert}>
                            <p>Recuerde que no se pueden eliminar encargados del seguimiento,
                            por lo que usted y los demás encargados ya se encuentran seleccionados
                            y no es necesario que se seleccionen nuevamente en la lista que se muestra a continuación</p>
                        </div>
                        <Col
                            md={11}
                            sm={11}
                            xs={11}
                        >
                            <MuiThemeProvider theme={theme}>
                                <MUIDataTable
                                    data={userData}
                                    options={
                                        {
                                            searchFieldStyle: { width: '30%', margin: 'auto', marginRight: '0px' },
                                            selection: true,
                                            onRowSelectionChange: (users) => handleSelectUsers(users),
                                            selectToolbarPlacement: 'none',
                                            actionsColumnIndex: -1,
                                            downloadOptions: { filename: `Integrantes.csv` },
                                            viewColumns: false,
                                            sort: true,
                                            filter: true,
                                            responsive: 'standard',
                                            textLabels: {
                                                body: {
                                                    noMatch: "No se encontraron registros",
                                                },
                                                pagination: {
                                                    next: "Siguiente Página",
                                                    previous: "Página Anterior",
                                                    rowsPerPage: "Filas por página:",
                                                    displayRows: "de",
                                                },
                                                toolbar: {
                                                    search: "Buscar",
                                                    downloadCsv: "Descargar CSV",
                                                    print: "Imprimir",
                                                },
                                            }

                                        }
                                    }
                                    components={MTConfig().components}
                                    localization={MTConfig().localization}
                                    columns={[

                                        {
                                            name: "id",
                                            label: "Id",
                                            options: {
                                                display: false,
                                                filter: false
                                            },

                                        },
                                        {
                                            name: "name",
                                            label: "Nombre",
                                        },
                                        {
                                            name: "last_name",
                                            label: "Apellido",
                                        },
                                        {
                                            name: "legajo",
                                            label: "Legajo",
                                        },
                                        {
                                            name: "email",
                                            label: "Email",
                                        },
                                    ]}
                                />
                            </MuiThemeProvider>
                        </Col>
                    </>
            }
        </Row>

    )
}

export default ParticipantsTable