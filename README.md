## 🎉 Intro

**`✅ This is a Web RTC project made with create-next-app ✅`** 

This is **`Front End`** of Web RTC-based live streaming project

Hey, there! I'm **`SEUNGMIN LEE`** and welcome to the core of my live-streaming journey. 
This project represents where Web RTC(Real-Time Communication) meets seamless real-time video delivery. It’s been fueled by my passion for interactive media, backed by countless hours of coding and fine-tuning 🛠️.

From concept to execution, this project is packed with moments of breakthrough and discovery. Whether it was solving tricky WebRTC challenges or building robust CI/CD pipelines, every piece of it captures those "Wait, what if I try this?" moments followed by "Yes, it worked!" victories 🎯.

Take a deep dive into this live-streaming experience, and get a glimpse of the dedication behind the code 💡. I hope you enjoy exploring it as much as I did building it!

So, kick back, have a look, and enjoy the ride through **`my coding adventure 😎`** 

&nbsp; 
## ⚙️ Installation

```bash
# clone the repoistory
git clone https://github.com/vderckdeveloper/Live_Streaming_Client.git
```

```bash
# navigate to the project directory 
cd /your-project-route
```

```bash
# install dependencies
npm install
```

&nbsp; 
## 🚀 Start

Run the server:

```bash
# development mode
npm run dev
```

```bash
# production mode
npm run start
```

You can Start this project with PM2 or Docker.

```bash
# pm2 start mode
pm2 start ecosystem.config.js
```

```bash
# build docker file
docker build -t 'project-name' ./
```

```bash
# start with docker-compose.yml. 
# this project does not come with configured docker-compose. make you own to run it with docker
docker compose up -d 
```

&nbsp; 
## 📁 Folder Structure 

Folder structure bellow will be updated later
&nbsp; 
```bash
│  .dockerignore                      // docker ingore
│  Dockerfile                         // docker build config
│  ecosystem.config.js                // pm2 config
│  .eslintrc.json                     // eslint config
│  .gitignore                         // git ignore config
│  next-env.d.ts                      // environment variable 
│  next.config.mjs                    // next js config
│  package-lock.json                  // package lock json
│  package.json                       // package json
│  README.md                          // README.md
│  tsconfig.json                      // js config
│          
├─public                              // static files
│  ├─fonts                            // fonts
│  └─image                            // image
│      ├─main
│      ├─sidebar
│      └─toolbar
├─src                                 // app router
│  ├─app                              
│  │  ├─(main)
│  │  └─(stream)
│  │      └─stream
│  │          └─[code]
│  ├─component                        // all component
│  │  ├─footer                        // footer
│  │  ├─main                          // main
│  │  │  ├─mainbody
│  │  │  └─mainSlide
│  │  ├─stream                        // stream
│  │  │  ├─screen
│  │  │  ├─setting
│  │  │  └─sidebar                    
│  │  └─toolbar                       // toolbar
│  └─styles                           // global css
└─utils                               // utility
```

&nbsp; 
## 🌐 OFFICAL WEBSITE

Open [https://liveedumeet.com](https://liveedumeet.com)

&nbsp; 
## 🔒 LICENSE

- This project and all of its contents are the sole property of **`SEUNGMIN LEE`**.
- The software is provided as-is without warranty of any kind, express or implied. 
- No license is granted for reuse, modification, distribution, or commercial use by other parties without explicit written permission from **`SEUNGMIN LEE`**.
- This project is proprietary software intended exclusively for use by **`SEUNGMIN LEE`**, and any access, use, modification, or distribution by anyone other than **`SEUNGMIN LEE`** is strictly prohibited.
- For any inquiries regarding the use, distribution, or modification of this project, please contact **`SEUNGMIN LEE`**.

&nbsp; 
## 📞 CONTACT

**`SEUNGMIN LEE`**

- **📩 Email**: [vderckdeveloper@gmail.com](mailto:vderckdeveloper@gmail.com)
- **📱 Phone**: +82 010 7303 5185 