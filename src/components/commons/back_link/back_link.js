import { IconButton } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const BackLink = ({url}) => {
    const router = useRouter();
    const [paramId, setParamId] = useState();

    useEffect(()=>{
        let params = Object.values(router.query);
        let id = params[0];
        setParamId(id);
    },[router.query])

    return (
        <>
            <Row lg={12} md={12} sm={12} xs={12}>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Link href={url || `/dashboard/seguimientos/${paramId}`}>
                        <IconButton>
                            <KeyboardBackspaceIcon style={{color:'white'}} />
                        </IconButton>
                    </Link>
                </Col>
            </Row>

        </>
    )
}

export default BackLink;