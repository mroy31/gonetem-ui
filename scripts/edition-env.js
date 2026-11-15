const VALID_EDITIONS = ["full", "student"];

const readEditionEnv = (env = process.env) => {
    const edition = env.GONETEM_EDITION === undefined || env.GONETEM_EDITION === ""
        ? "full"
        : env.GONETEM_EDITION;

    if (!VALID_EDITIONS.includes(edition)) {
        throw new Error(
            `Invalid GONETEM_EDITION "${edition}": expected one of ${VALID_EDITIONS.join(", ")}`
        );
    }

    const studentServerUri = env.GONETEM_SERVER_URI ?? "";

    if (edition === "student" && studentServerUri.trim() === "") {
        throw new Error(
            "The student edition requires a non-empty GONETEM_SERVER_URI"
        );
    }

    return { edition, studentServerUri };
};

module.exports = { VALID_EDITIONS, readEditionEnv };
