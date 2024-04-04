// import React, { useRef, useState } from "react";
// import {
//   Box,
//   Textarea,
//   Button,
//   List,
//   ListItem,
//   Divider,
//   Card,
//   InputGroup,
//   InputRightElement,
//   Input,
//   IconButton,
// } from "@chakra-ui/react";
// import { AttachmentIcon } from "@chakra-ui/icons";

const CommentBox = () => {
    //   const [image, setImage] = useState(null);
    //   const fileInputRef = useRef(null);

    // const [comment, setComment] = useState("");
    // const [commentsList, setCommentsList] = useState([{
    //   comment: 'Request confirmation email was sent to the mnit.harsh1984@gmail.com.',
    //   date: '31st August 2023',
    //   time: '03:35 PM',
    //   button: [{text: 'ResendEmail'}]
    // },
    // {
    //   comment: 'mnit.harsh1984@gmail.com created request for order #1007.',
    //   date: '31st August 2023',
    //   time: '03:35 PM',
    //   button: [{text: 'ResendEmail'}]
    // }]);

    // const handleCommentChange = (e) => {
    //   setComment(e.target.value);
    // };

    // const handleAddComment = () => {
    //   if (comment.trim() !== "") {
    //     setCommentsList([...commentsList, comment]);
    //     setComment("");
    //   }
    // };

    // const handleImageUpload = (event) => {
    //   const selectedImage = event.target.files[0];
    //   if (selectedImage) {
    //     setImage(URL.createObjectURL(selectedImage));
    //   }
    // };

    // const handleIconClick = () => {
    //   // Trigger the hidden file input
    //   fileInputRef.current.click();
    // };
    // const handlePostComment = () => {
    //   // Call your API here to post the comment
    //   // You can add the API logic and handling here
    //   console.log("Posting comment...");
    // };

    return (
        <div>comment box</div>
        // <Card>
        // <Box>
        // <Box>
        //   <InputGroup>
        //     <Input
        //       placeholder="Leave a comment..."
        //       pr="4rem" // Padding on the right side to accommodate the icon
        //     />
        //     <InputRightElement width="8rem">
        //       <label htmlFor="image">
        //         <IconButton
        //           as="span"
        //           aria-label="Attach Image"
        //           icon={<AttachmentIcon />}
        //           size="sm"
        //           colorScheme="blue"
        //           onClick={handleIconClick}
        //           cursor="pointer" // Make the icon clickable
        //         />
        //       </label>
        //       <Button
        //         size="sm"
        //         colorScheme="blue"
        //         onClick={handlePostComment}
        //         ml="2"
        //       >
        //         Post
        //       </Button>
        //     </InputRightElement>
        //   </InputGroup>
        //   <input
        //     type="file"
        //     id="image"
        //     accept="image/*"
        //     onChange={handleImageUpload}
        //     style={{ display: "none" }}
        //     ref={fileInputRef}
        //   />
        //   {image && (
        //     <Box p="4">
        //       <img src={image} alt="Uploaded" style={{ maxWidth: "100px" }} />
        //     </Box>
        //   )}
        // </Box>
        //     <List spacing={2}>
        //         {commentsList.map((comment, index) => (
        //         <ListItem key={index}>
        //             {comment.comment}
        //             <Divider />
        //         </ListItem>
        //         ))}
        //     </List>
        //     </Box>
        // </Card>
    )
}

export default CommentBox
