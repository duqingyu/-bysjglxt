var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require('express-session');
//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//模板引擎
app.set("view engine","ejs");
//静态页面
app.use(express.static("./public"));
app.use("/avator",express.static("./avatar"));
//路由表

app.get("/",router.showIndex);              //显示首页
app.get("/register",router.shouRegister);              //显示首页
app.post("/doregister",router.doRegister);              //显示首页
app.get("/login",router.showLogin);              //显示首页
app.post("/dologin",router.doLogin);              //显示首页


app.get("/tomanager",router.tomanager);   //管理员
app.get("/tomanagersystemnotice",router.tomanagersystemnotice);//管理员公告系统
app.post("/managerinsertNotice",router.managerinsertNotice);//管理员公告系统LastNotice
app.get("/LastNotice",router.LastNotice);//管理员公告系统LastNotice
app.get("/delgonggao",router.delgonggao);//管理员公告系统/delgonggao
app.get("/tomanagerInbox",router.tomanagerInbox);//管理员收件箱
app.get("/tomanagerteacher",router.tomanagerteacher);//老师表
app.get("/tomanagerstudent",router.tomanagerstudent);//学生表
app.post("/tmanagerUpload",router.tmanagerUpload);//管理员上传老师Excel
app.post("/smanagerUpload",router.smanagerUpload);//管理员上传学生Excel
app.get('/tdownload',router.tdownload);//管理员下载老师EXCEL
app.get('/sdownload',router.sdownload);//管理员下载学生EXCEL
app.get("/tomanagerLast",router.tomanagerLast);
app.get("/tomanagerchancepassword",router.tomanagerchancepassword);//管理员修改密码
app.post("/toMannagerChancePassword",router.toMannagerChancePassword);//管理员修改密码功能
app.get("/tomanagerpending",router.tomanagerpending);//管理员审核通过
app.get("/tomanagerassigned",router.tomanagerassigned);//管理员分配学生老师
app.get("/managerTeacherSelect",router.managerTeacherSelect);//审核页面
app.get("/managerupdateTeacherSelect",router.managerupdateTeacherSelect);//审核通过
app.get("/managerupdateTeacherSelect1",router.managerupdateTeacherSelect1);//审核不通过
app.get("/getAllStudentSelect",router.getAllStudentSelect);///得到所有选择信息
app.post("/getLastStudentSelect1",router.getLastStudentSelect1);///分配志愿一
app.post("/getLastStudentSelect2",router.getLastStudentSelect2);///分配志愿二
app.post("/getLastStudentSelect3",router.getLastStudentSelect3);///分配志愿三
app.get("/managerLast",router.managerLast);
app.get("/managerLastAgain",router.managerLastAgain);




app.get("/tostudent",router.tostudent);   //学生
app.get("/tostudentsystemnotice",router.tostudentsystemnotice);//学生公告系统
app.get("/tostudentdata",router.tostudentdata);//学生个人信息
app.post("/tijiao",router.tijiao);//学生信息提交
app.get("/getstudentdata",router.getstudentdata);//学生首页个人信息资料获取
app.get("/tostudentupload",router.tostudentupload);//学生上传
app.post("/StudentUpload",router.StudentUpload);//学生上传
app.get("/showdown",router.showdown);//显示学生上传-在学生页面
app.get("/showdown1",router.showdown1);//显示学生上传-在老师页面
app.get("/Studenttoupfile",router.Studenttoupfile);//学生指导书页面
app.get("/tosendemail",router.tosendemail);//学生发送邮件
app.post("/fasong",router.fasong);//学生发送邮件
app.get("/getemdata",router.getemNumber);//学生发送邮件
app.get("/toliuyan",router.toliuyan);//学生留言
app.get("/tostudentSelect",router.tostudentSelect);//选生选题
app.get("/studentGetTeacherSelect",router.studentGetTeacherSelect);//学生获取选题数据
app.get("/getTeacherName",router.getTeacherName);//学生获取选题数据
app.post("/StudentSelect",router.StudentSelect);//学生确认选题数据
app.get("/getStudentSelect",router.getStudentSelect);//学生确认选题数据
app.get("/delTeacherTitle",router.delTeacherTitle);//学生确认选题数据
app.get("/studentLast",router.studentLast);//学生Last
app.get("/StudentTeacherLastNotice",router.StudentTeacherLastNotice);//学生老师公告
app.get("/tostudentchancepassword",router.tostudentchancepassword);//学生修改密码
app.post("/toStudentChancePassword",router.toStudentChancePassword);//学生修改密码功能





app.get("/toteacher",router.toteacher);    //老师
app.get("/toteachersystemnotice",router.toteachersystemnotice);//老师公告系统
app.get("/toteacherLast",router.toteacherLast);//老师最终情况
app.get("/teacherLast",router.teacherLast);//老师最终情况
app.get("/ThisStudent",router.ThisStudent);//老师得到学生详细信息
app.get("/ThisStudentavator",router.ThisStudentavator);//老师得到学生头像
app.get("/teacherdown",router.teacherdown);//老师下载
app.get("/todown",router.todown);//老师下载学生作品
app.get("/toteachernotice",router.toteachernotice);//老师发布指导书
app.post("/teacherinsertNotice",router.teacherinsertNotice);//老师发布指导书
app.get("/LastNotice1",router.LastNotice1);//老师发布指导书
app.get("/delgonggao1",router.delgonggao1);//老师发布指导书
app.get("/teacherliuyan",router.teacherliuyan);//老师留言区
app.post("/TeacherSelect",router.TeacherSelect);//插入老师选题数据
app.get("/getTeacherSelect",router.getTeacherSelect);//得到老师选题数据
app.get("/tuichuTeacherSelect",router.tuichuTeacherSelect);//老师退出申请选题
app.get("/toteacherselect",router.toteacherselect);//老师选题页面
app.get("/teacherchancepassword",router.teacherchancepassword);//老师修改密码
app.post("/toTeacherChancePassword",router.toTeacherChancePassword);//老师修改密码





app.get("/avator",router.showavator);              //显示首页
app.post("/doavator",router.doavator);              //显示首页
app.get("/showcut",router.showcut);              //显示首页
app.get("/docut",router.docut);
app.post("/insertpinglun",router.insertpinglun)
app.get("/neirong",router.neirong)
app.get("/users",router.users)
app.get("/Allcount",router.Allcount)
app.listen(3000);
