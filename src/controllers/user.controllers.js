import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponce } from "../utils/apiResponce.js"

const registerUser = asyncHandler(async (req, res,) => {
    /*
    Get User details from front-End
    Validation - not empty
    Check if user already exists :  username, email
    Check for Images, Check for Avatar
    Upload them to cloudinary, avatar
    Create user object, create entry in database
    Remove password and refresh token field from responce
    check for user creation
    return res
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


    const existingUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with email or username is already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required!!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar image is required!!")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponce(200, createdUser, "User registered succesfully!!")
    )
})

export { registerUser }