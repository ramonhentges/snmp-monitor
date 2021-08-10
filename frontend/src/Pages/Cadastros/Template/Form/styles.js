import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root:{
    padding: theme.spacing(2),
  },
  field: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "99%",
    },
  },
  button: {
    float: "right",
  },  
}));

export default useStyles;
