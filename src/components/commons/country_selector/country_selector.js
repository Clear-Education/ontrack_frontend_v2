import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss'
import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const CountrySelector = ({ setState, previousValue, color }) => {

    const [country, setCountry] = useState(previousValue ? previousValue.provincia : '');
    const [region, setRegion] = useState(previousValue ? previousValue.localidad : '');

    useEffect(() => {
        setCountry(previousValue.provincia)
        setRegion(previousValue.localidad)
    }, [previousValue]);

    const handleSetCountry = (country) => {
        setState('provincia', country);
        setCountry(country);
    }

    const handleSetRegion = (region) => {
        setState('localidad', region);
        setRegion(region);
    }

    return (
        <Row lg={12} md={12} sm={12} xs={12}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.container}
            >
                <Col lg={6} md={6} sm={12} xs={12} className={styles.country_container}>
                        <CountryDropdown
                            defaultOptionLabel="Seleccione un país"
                            value={country}
                            onChange={(country) => handleSetCountry(country)}
                            style={{
                                padding: '15px 0 15px 8px',
                                borderRadius: '5px',
                                color: 'black',
                                borderColor: '#bfbfbf',
                                cursor: 'pointer',
                                width: '100%',
                                outline: 'none',
                                backgroundColor: color ? '#f1f1f1' : 'unset'
                            }}
                        />
                </Col>

                <Col lg={6} md={6} sm={12} xs={12} className={styles.region_container}>
            
                        <RegionDropdown
                            disableWhenEmpty={true}
                            country={country}
                            value={region}
                            defaultOptionLabel="Seleccione una provincia"
                            onChange={(region) => handleSetRegion(region)}
                            style={{
                                padding: '15px 0 15px 8px',
                                borderRadius: '5px',
                                color: 'black',
                                borderColor: '#bfbfbf',
                                width: '100%',
                                cursor: 'pointer',
                                outline: 'none',
                                backgroundColor: color ? '#f1f1f1' : 'unset'
                            }}
                        />
         
                </Col>

            </motion.div>
        </Row>
    )

}

export default CountrySelector