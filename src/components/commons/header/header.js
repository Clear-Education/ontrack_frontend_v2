// Import dependencias
import { Row, Col } from "react-bootstrap";

// Import componentes
import styles from "./header.module.css";
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { IconButton, useTheme, useMediaQuery, Avatar } from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useEffect, useState } from "react";
import { logoutAction } from "../../../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import LogOutIcon from "../icons/logout_icon";
import config from "../../../utils/config";

const Header = () => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up(767));
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const [profileImg,setProfileImg] = useState();

  const handleOpen = () => {
    setOpen(!open);
  }

  useEffect(()=>{
    setProfileImg(user.user.picture)
  },[])

  const logout = () => {
    handleOpen();
    dispatch(logoutAction(user.user.token)).then((result) => {
      if (result) {
        router.push("/");
      }
    });
  };

  return (
    <div id={styles.header_container}>
      <Row lg={12} md={12} sm={12} xs={12}>
        <Link href="/dashboard">
          <Col className="left" lg={8} md={8} sm={8} xs={8} style={{ cursor: 'pointer' }}>
            <div className={styles.logo_container}>
              <img src={fullScreen ? `/OnTrack.svg` : `/OnTrack_mini.svg`} id={fullScreen ? styles.logo : styles.mini_logo} />
            </div>
          </Col>
        </Link>

        <Col lg={4} md={4} sm={4} xs={4}>
          <Col lg={12} md={12} sm={12} xs={12} className={styles.info_container}>
            <div className={styles.user_info_container} onClick={handleOpen}>
              <div className={styles.avatar_container}>
                <Avatar
                  src={profileImg ? profileImg : config.default_picture}
                />
              </div>
              <div className={styles.label_container}>
                <span className={styles.name_label}>{user.user.name}   {user.user.last_name}</span>
                <span className={styles.role_label}>{user.user.groups} </span>
                <span className={styles.arrow}>{open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span>
              </div>
            </div>
            <div className={styles.collapse_container} style={open ? { display: 'unset' } : { display: 'none' }}>
              <div className={styles.collapse_body} >
                <Link href="/dashboard/profile">
                  <span className={styles.options_label} onClick={handleOpen}><PersonIcon /> <span className={styles.options_label_description}>Mi perfil</span></span>
                </Link>
                <span className={styles.options_label} onClick={logout}> <LogOutIcon color="#6f6f6f" /> <span className={styles.options_label_description}>Cerrar sesión</span></span>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Header;
