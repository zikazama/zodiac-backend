export interface JwtPayload {
    sub: string;        // Typically the user ID
    _id: string,
    username: string;   // The username of the user
    email: string;   // The email of the user
}
