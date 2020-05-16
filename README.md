# Covid-19 Volunteering Portal by Shreyas Gupta

Covid-19 Volunteering Portal is a portal which lets you list yourself as a volunteer to help out people or organisations during these unfortunate times, and lets organisations or people in need get in touch with people who are willing to volunteer.

**It is live at: [covid19-volunteer.herokuapp.com](https://covid19-volunteer.herokuapp.com/)**

## Tech Stack

* HTML/CSS/JS
* Expressjs with Nodejs
* Mongodb using Mongoose driver
* EJS Rendering engine

## Current UI Screenshots

Home Page:
![](https://i.imgur.com/wuuJGl9.png)

Become a Volunteer Page:
![](https://i.imgur.com/aeOdPjQ.png)

Search a Volunteer Page:
![](https://i.imgur.com/J7fhMjS.png)

Confirmation Page for Error/Success:
![](https://i.imgur.com/zfQj8n5.png)

## Local Setup Tutorial

```bash
$ git clone https://github.com/sggts04/sggts04-SGR-2
$ cd sggts04-SGR-2
$ npm install
```
Make sure to install MongoDB from [the official source](https://www.mongodb.com/download-center/community?tck=docs_server).

Then run `npm run dev` which uses `nodemon` to run the server, which basically restarts the server whenever the source code is changed.

Lastly, navigate to `localhost:3000` to get to the homepage.

## Routes

### Index Route GET `/`:
Renders the homepage which lets you navigate to the volunteer register form or the search volunteer page.

### Volunteer Form Route GET `/volunteer`:
Renders the volunteer form which user can use to register themself as a volunteer. Before submission of form there is a client side validation of the form, if there is any problem then the form is not posted. If validated, the form is POSTed to `/volunteer`

### Volunteer Form Route POST `/volunteer`:
Once data is recieved, there is a server side validation of the data, if any problem is there, volunteer is not registered and a dynamic error page is returned. If validated, the volunteer is inserted into the `Volunteer` collection in MongoDB, and a success page is returned.

### Volunteer Search Route GET `/contact` or `/contact?state=x&medical=y`:
Using the parameters of the GET request, `state`(which state) and `medical`(if volunteer should be medical student), the `Volunteer` collection is queried and data is returned and rendered in a table in `contact.html`. The html page also has a form to query the data again based on state and medical knowledge, and the form on submission again sends a GET request to `/contact`

## Volunteer Collection Model

### name
String: Volunteer's name.

### age
Number: Volunteer's age. Should be greater than 10 be eligible. Validated both client side and server side.

###	state
String: Volunteer's state. Selected through a drop down.

### skills
String: Description of how volunteer can help.

### medical
Boolean: Whether volunteer is a medical student or graduate.

### email
String: Volunteer's email. Validated both client side and server side.

### phone
Number: Volunteer's mobile number. Validated both client side and server side.

### date
Date Object: Date of volunteer's registration. Set automatically on insertion of new volunteer.
