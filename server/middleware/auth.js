import jwt from "jsonwebtoken";

const authenticationMiddleware = (req, res, next) =>
{
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]; // Bearer token

    if (!token)
    {
        return res.status(401).json({ message: "No token provided" });
    }

    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }

    catch (error)
    {
        res.status(500).json({message: "Failed to authenticate token"});
    }
};

export default authenticationMiddleware;