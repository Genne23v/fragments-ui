# Fragments UI

Fragments UI is an interface for users to add, update, view and delete fragments that is hosted in `fragments API`. Users can post a fragment by sending a user-typed text or a supported file. The user can view all of own user's fragments posted. Users can see a table of fragments that shows the metadata and available actions such as view, update, delete. User can download a converted fragment if conversion is supported for the content type.

## Upload Fragment

You can either type a text or upload a supported file to post a fragment. Supported types of content are as below.

-   text/plain
-   text/plain; charset=utf-8
-   text/markdown
-   text/html
-   application/json
-   image/png
-   image/jpeg
-   image/webp

> Note: Content size must be less than `5MB`

## View/Convert Fragment

By clicking `View` button on each fragment row on the table, the user will be able to see the content of a fragment. If it's a text, it will be displayed in a text box. JSON data is also formatted nicely for the user. Image preview is provided if the content is image type.

Fragment conversion is available for below cases.
| Content Type | Valid Conversion |
| ---------------- | ---------------- |
| text/plain | .txt |
| text/markdown | .txt, .md, .html |
| text/html | .txt, .html |
| application/json | .txt, .json |
| image/png | .png, .jpg, .webp, .gif |
| image/jpeg | .png, .jpg, .webp, .gif |
| image/webp | .png, .jpg, .webp, .gif |
| image/gif | .png, .jpg, .webp, .gif |

## Update Fragment

If content is text, content will be shown in a text box. The user can update the text or add a file to overwrite the content regardless of original content type.

## Delete Fragment

By clicking `Delete` button, fragment will be removed in the table and `fragments API`.

## Scripts

`npm run start` to run Fragments UI on local

## Revision

| Version | Release Content                           | Date         |
| ------- | ----------------------------------------- | ------------ |
| 0.6.0   | Add update fragment feature               | Dec 8, 2022  |
| 0.5.0   | Add view/convert fragment feature         | Dec 7, 2022  |
| 0.4.0   | Add delete fragment feature               | Dec 1, 2022  |
| 0.3.0   | Add file drag and drop. Dockerize the app | Nov 6, 2022  |
| 0.2.0   | Add text content upload capability        | Oct 5, 2022  |
| 0.1.0   | Sign up and log in page                   | Sep 16, 2022 |
