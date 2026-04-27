import { EARS_App } from "./EARS-App";
import dotenv from 'dotenv';

dotenv.config();

EARS_App.listen(process.env.PORT, () => {
    console.log('Server corriendo en puerto:', process.env.PORT)
});