import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    typography: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    margin: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    grid: {
        marginRight: theme.spacing(2),
    },
}));

export default useStyles;
