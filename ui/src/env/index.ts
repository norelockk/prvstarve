import dev from "./stage/dev";
import prod from "./stage/prod";

export default process.env.NODE_ENV === 'production' ? prod : dev;