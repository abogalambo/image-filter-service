import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query

    // validate image_url
    if (!image_url) {
      res.status(400).send('Missing required query parameter image_url')
      return
    }

    // call filterImageFromURL(image_url) to filter the image
    try{
      let filePath = await filterImageFromURL(image_url)

      // send the resulting file in the response
      res.status(200).sendFile(filePath)

      // delete any files on the server on finish of the response
      res.on('finish', () => deleteLocalFiles([filePath]))
    } catch(err) {
      console.log(`image_url is: ${image_url}`)
      console.error(err);
      res.status(422).send('Something went wrong! Please make sure the image is publicly accessible and is a valid image file')
    }    
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
