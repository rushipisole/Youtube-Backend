import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";



const registerUser = asyncHandler(async (req, res,) => {
    /*
    Get User details from front-End
    Validation - not empty
    Check if user already exists : username, email
    */



    const { username, email, fullName, password } = req.body
    console.log(email);

    if (
        [
            fullName, username, email, password
        ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!!")
    }
})

export { registerUser }