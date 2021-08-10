import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  gridButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
  borda: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

export default useStyles;
