import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Visit } from "../model/Visit.models.js"

const registerUser = asyncHandler(async (req, res) => {


    //1. get user in json from frontend 
    const { nameofuser, email, username, password, profession } = req.body
    console.log("email: ", email, nameofuser);

    //2. backend validate for fields
    // if (
    //     [nameofuser, email, username, password, profession, isDoctor].some((field) => field?.trim() === "")
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }
    if (
        !req.body.nameofuser?.trim() ||
        !req.body.email?.trim() ||
        !req.body.username?.trim() ||
        !req.body.password ||
        !req.body.profession
    ) {
        throw new ApiError(400, "All fields are required");
    }


    //3. check if user already exists or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with such email|username already exists!!!")
    }


    //4. create user object - create entry in db
    const user = await User.create({
        nameofuser,
        email,
        password,
        username: username.toLowerCase(),
        profession
    })

    //after creating new user in db check what are its fields expect pass and refTokn
    const createdUser = await User.findById(user._id).select(
        //"-password -refreshToken"
    )
    // if after creating new user successfull in db, it didn't came then
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while regestring user!!")
    }

    //return responce
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User created successfully")
        )











    // res.status(200).json({
    //     message: "Ok"
    // })
})




const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const loginUser = asyncHandler(async (req, res) => {

    // 1. take data from request body
    const { email, username, password } = req.body

    // 2. if in body there is no field/empty then throw error 
    if (!(req.body.email?.trim() || req.body.username?.trim())) {
        throw new ApiError(400, "username | password is required");
    }


    // 3. based on req email|username check in db 
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User with such email|username does not exists !!!")
    }



    // 4. if user exists in db then check for password
    const isPasswordValid = await user.isPasswordCorrect(password)   //passing password is form req.body

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user password")
    }


    // 5. generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    // 6. find the data of logged in user from db
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //     // 7. send cookies
    //     const options = {
    //         httpOnly: true,
    //         secure: true
    //     }

    //     return res
    //         .status(200)
    //         .cookie("accessToken", accessToken, options)
    //         .cookie("refreshToken", refreshToken, options)
    //         .json(
    //             new ApiResponse(
    //                 200,
    //                 {
    //                     user: loggedInUser, accessToken, refreshToken
    //                 },
    //                 "User logged In Successfully"
    //             )
    //         )
    // })


    // 7. send cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Important: Only true in production (HTTPS)
        sameSite: "None", // "Lax" is a good default, but might need "None" for cross-site
        // domain: process.env.COOKIE_DOMAIN || "localhost", // Set your actual domain
        // domain: "localhost",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (adjust as needed)

    };

    res.clearCookie("accessToken", { domain: 'localhost', path: '/' });
    res.clearCookie("refreshToken", { domain: 'localhost', path: '/' }); // same options here
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    // set as string then not only send,, to maintain type

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {

                    //  user: loggedInUser
                    accessToken,
                    refreshToken
                },
                "User logged In Successfully"
            )
        );
});





const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            // $set: {
            //     refreshToken: 1
            // }
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))


})



// end point where user can refresh its refresh rtoken
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log(incomingRefreshToken, "oo");


    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true,

            sameSite: "None",
            domain: "localhost", // or set it from ENV
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


//change password 
const changeCurrentPassword = asyncHandler(async (req, res) => {

    // 1. get this 2 fields from req body-frontend
    const { oldPassword, newPassword } = req.body


    // 2. get the id of logged in user(here from auth-middleware),, as he can change password only if he is logined
    const user = await User.findById(req.user?._id)

    // check if old password typed is correct or not from db(by comparing it with user which u got from query,, prev line)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }


    // 3. if old pass is ok,, then update password field in db with new one 
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {}, // or to get user detail back user "req.user"
            "Password changed successfully"))

})


//api to get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})


//updates the user/logged in user profession
const updateProfession = asyncHandler(async (req, res) => {
    const { profession } = req.body
    console.log("ll- called here\n \n hiiediedii")
    if (!profession) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profession: profession,
            }
        },
        { new: true }

    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const checkInCookies = asyncHandler(async (req, res) => {

    // take ref-tocken into a var either from cookie or body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log(incomingRefreshToken);

    //check if incomming refresh tocken is null or not
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    const user = await User.find({ refreshToken: incomingRefreshToken }).select("-password")

    if (!user || user.length === 0) {
        throw new ApiError(404, "No refresh tocken found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User with incomming refresh tocken found retrieved successfully"));

});



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateProfession,
    checkInCookies,
}



