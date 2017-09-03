var formidable = require('formidable')
var db = require('../models/my_db')
var md5 = require('../models/md5')
var path = require("path")
var fs = require("fs")
var gm = require('gm').subClass({imageMagick:true});
var util = require('util')

//主页
exports.showIndex = function (req, res, next) {
        res.render("index", {
            "active": "首页"
        });

}
//注册登录开始
exports.shouRegister = function (req, res, next) {
    res.render('register',{
        login: req.session.login,
        username: req.session.username,
        active:'注册'
    })
}



exports.doRegister = function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        console.log(fields);
        var username = fields.username;
        var password = md5(fields.password);
        var int = 1;

        db.findDocuments("users", {"username": username}, function (err, data) {
                if (err) {
                    res.send("-3")
                } else if (data.length > 0) {
                    res.send("-1")
                } else {
                    db.insertDocuments("users", {
                        "username": username,
                        "password": password,
                        "int": int,
                        "avator":"moren.jpg"
                        },
                        function (err, data) {
                        // console.log(err);
                        if (err) {
                            res.send("-3")
                        } else {
                            req.session.login = 1;
                            req.session.username = username;
                            res.send('1')
                        }
                    })
                }
            }
        )
    });
}

//登陆页面
exports.showLogin = function (req, res, next) {
    res.render('login',{
        login: req.session.login,
        username: req.session.username,
        active:'登陆'
    })
}



//学生测试页面
exports.tostudent = function (req, res, next) {
      if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
        db.findDocuments('users',{"username":req.session.username},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        var x = "";
           if(result[0].avator == req.session.username+".jpg"){ x= result[0].avator } 
           else{
               x = "moren.jpg";
           }
      res.render('student',{
       title:"学生测试页面",
       username:req.session.username,
       avator:x
        })
    })

   
}
//学生上传页面
exports.tostudentupload = function (req, res, next) {
      if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
    res.render('studentupload',{
       title:"学生测试页面",
       username:req.session.username
    })
}


//学生公告系统
exports.tostudentsystemnotice = function (req, res, next) {
      if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
    res.render('studentsystemnotice',{
       title:"学生公告系统",
       username:req.session.username
    })
}

//学生老师公告系统StudentTeacherLastNotice
exports.StudentTeacherLastNotice = function (req, res, next) {
             db.findDocuments('gonggao',{"status":"发布成功"},{sort:{"time":-1}},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        console.log(result)
        
        
          res.json({"result":result});
    })

}

//学生个人信息
exports.tostudentdata = function (req, res, next) {
      if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
         db.findDocuments('users',{"username":req.session.username},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        var x = "";
           if(result[0].avator == req.session.username+".jpg"){ x= result[0].avator } 
           else{
               x = "moren.jpg";
           }
      res.render('studentdata',{
       title:"学生设置个人信息",
       username:req.session.username,
       avator:x
        })
    })
}
//学生首页信息数据处理
exports.getstudentdata = function (req, res, next){
        db.findDocuments('studentdata',{"check":req.session.username},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
     
          res.json({"result":result});
    })
}



//将数据插入数据库
exports.tijiao = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //删除相同数据
            db.DelDocuments('studentdata',{"check":req.session.username},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        else{
      //重新插入
            db.insertDocuments('studentdata',{
          "getNumber":fields.Number,
          "getName":fields.Name,
          "getSchool":fields.School,
          "getLevel":fields.Level,
          "getMajor":fields.Major,
          "getClass":fields.Class,
          "getDiplomas":fields.Diplomas,
          "getPhonenumber":fields.Phonenumber,
          "check":req.session.username
        },function (err, result) {
           res.send("1");
        })
           
        }
        
    }) 
    })
  
}
//学生发送邮件
exports.tosendemail = function (req, res, next){
    if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
    else{

      res.render('sendemail',{
          title:"学生邮件页面",
          username:req.session.username
      })
    }
}

//管理员收件箱
exports.tomanagerInbox = function (req, res, next){
if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
    else{

      res.render('managerInbox',{
          title:"管理员邮件页面",
          username:req.session.username
      })
    }
}

//学生发送邮件信息
exports.fasong = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
    
        db.insertDocuments('sendemail',{
          "getemNumber":fields.emNumber,
          "getemName":fields.emName,
          "getemContent":fields.emContent,
          "emstatus":"发送成功",
          "time":new Date().toLocaleString()
        },function (err, result) {
           
        })
    })
  
}
//学生发送邮件信息
exports.getemNumber = function (req, res, next){
        db.findDocuments('sendemail',{"emstatus":"发送成功"},{sort:{time:-1}},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
     
          res.json({"result":result});
    })
}

//学生得到老师名字SelectTeacherName
exports.getTeacherName = function (req, res, next) {
  db.findDocuments("users", {"int": 3}, function (err, result) {
           
                res.json({"result":result});

   } );      
}


//学生页面显示学生上传的作品
exports.showdown = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
       
  var file_path = path.normalize(__dirname + "/../StudentUpload");
  db.findDocuments("showdown", {"StudentName": req.session.username},{sort:{time:-1}}, function (err, result) {
  
 //按时间排序
   
      res.json({"result":result});
                      
})


    })
}

//老师页面显示学生上传的作品
exports.showdown1 = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
       
  var file_path = path.normalize(__dirname + "/../StudentUpload");
  db.findDocuments("showdown", {"TeacherName": req.session.username}, {sort:{time:-1}},function (err, result) {
  
res.json({"result":result});
                      
})


    })
}


//学生上传作品StudentUpload
exports.StudentUpload = function (req, res, next) {
                  
 var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../StudentUpload");
    form.parse(req, function (err, fields, files) {
        form.keepExtensions = true;
        // form.hash='md5';
        //files.file=form.hash;
         //限制字段域大小
        form.maxFieldsSize = 2 * 1024 * 1024;
    
       // form.maxFilesSize = 0.00002 * 1024 * 1024;
           var oldpath = files.zuopin.path;
        var extname = path.extname(files.zuopin.name);
        var newpath = path.normalize(__dirname + "/../StudentUpload") + "/" + fields.studentname+"-"+fields.studentnumber+"-"+fields.cishu+extname;
        var path1 =  fields.studentname+"-"+fields.studentnumber+"-"+fields.cishu+extname;
         db.insertDocuments('showdown',{
            "StudentName":req.session.username,
            "TeacherName":fields.teacher,
            "time":new Date().toLocaleString(),  
            "path":path1
        },function (err, result) {
              

            }
    );


        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send("失败");
                return;
            }
           res.redirect('/tostudentupload');

   
        });
    });

}


//学生上传指导
exports.Studenttoupfile = function (req, res, next) {
             db.findDocuments('gonggao1',{"status":"发布成功"},{sort:{"time":-1}},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        console.log(result)
        
        
          res.json({"result":result});
    })

}


//学生修改密码
exports.tostudentchancepassword = function (req, res, next){
               if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
   res.render('studentchancepassword',{
       title:"学生修改密码页面",
       username:req.session.username
    })

}

//学生修改密码
exports.toStudentChancePassword = function(req,res,next){
    var form = new formidable.IncomingForm();
 form.parse(req, function (err, fields, files) {
       console.log(fields);
        var username = fields.username;
        var password = md5(fields.PassWord);
       var NewPassWord1 = md5(fields.NewPassWord1);
        var NewPassWord2 = md5(fields.NewPassWord2);
 console.log(NewPassWord1);
  console.log(NewPassWord2);
db.findDocuments("users", {"username": username}, function (err, data) {
     if (err) {
                res.send("-3"); 
                
            }
     if(data.length == 0){
         res.send("-4");
         return;
     }
    if (data[0].password == password && data[0].int ==1 && NewPassWord1 == NewPassWord2) {
                      db.updateDocuments("users", {"username": username}, {
                  "password": NewPassWord1}, function (err, results) {
                })
                 res.send("1");
                    return;
    }
       if(NewPassWord1 != NewPassWord2){
           res.send("-2");
           return;
       }                                                                       
          else{
              res.send("-1");
              return;
          }

})

})
}

//学生留言
exports.toliuyan = function (req, res, next) {
      if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
    var username = req.session.username;
      db.findDocuments("users", {username: username}, function (err, result) {
        if (result.length == 0) {
            var avator = "moren.jpg";
        } else {
            var avator = result[0].avator;
        }
        res.render("studentliuyan", {
            "username": username,
            username:req.session.username,
            "active": "首页",
            "avator": avator    //登录人的头像
        });
    });
    
}

exports.tostudentSelect = function (req, res, next) {
      if(req.session.login!=1){
        res.send("请学生登录再访问")
        return
    }
    res.render('studentSelect',{
       title:"学生测试页面",
       username:req.session.username
    })
}

exports.studentGetTeacherSelect = function (req, res, next) {
     db.findDocuments('TeacherSelect',{"status":"审核通过"},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        console.log(result)
        
        
          res.json({"result":result});
    })
         
}

exports.StudentSelect = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        db.insertDocuments('StudentSelect',{
            "TeacherName":fields.TeacherName,
            "ClassName":fields.ClassName,
            "ClassType":fields.ClassType,
            "time":fields.time,
            "status":"录取进行中",
            "第一志愿":fields.Volunteer1,
            "第二志愿":fields.Volunteer2,
            "第三志愿":fields.Volunteer3,
            "time1":new Date().toLocaleString(),
            "StudentName":req.session.username
        },function (err, result) {
            res.send("1");
        })
    });
}


//学生delTeacherTitle
exports.delTeacherTitle = function(req,res){
     var time = req.query.time;
 db.DelDocuments('TeacherSelect',{"time":time},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        else{
           res.json({"result":result});
        }
        
    })

}

//学生选题情况delTeacherTitle
exports.getStudentSelect = function(req,res){
    
 db.findDocuments('StudentSelect',{"StudentName":req.session.username},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        console.log(result)
        
        
          res.json({"result":result});
    })
}

//学生Last
exports.studentLast = function(req,res){
     db.findDocuments('LastStudentSelect',{"StudentName":req.session.username},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        console.log(result)
        
        
          res.json({"result":result});
    })
}



//管理员测试页面
exports.tomanager = function (req, res, next){
    if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
    else{

      res.render('manager',{
          title:"管理员测试页面",
          username:req.session.username
      })
    }
}

//管理员公告系统managerinsertNotice
exports.tomanagersystemnotice = function (req, res, next){
    if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
    else{

      res.render('managersystemnotice',{
          title:"管理员公告系统",
          username:req.session.username
      })
    }
}

//管理员公告系统LastNotice
exports.managerinsertNotice = function (req, res, next){
          var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      
        db.insertDocuments('gonggao',{
             Notice:fields.Notice,
                 id:fields.id,
             status:"发布成功",
            "time":new Date().toLocaleString()
        },function (err, result) {
                res.send("1");
            
            }
    );
   
})
}

//管理员公告系统LastNotice/delgonggao
exports.LastNotice = function (req, res, next){
            db.findDocuments('gonggao',{"status":"发布成功"},{sort:{"time":-1}},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
     
        
        
          res.json({"result":result});
    })
}

//管理员公告系统/delgonggao
exports.delgonggao = function (req, res, next){
      var Notice = req.query.Notice;
 db.DelDocuments('gonggao',{"Notice":Notice},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        else{
            
            res.send("1");
        }
        
    })
}

//管理员分配老师学生
exports.tomanagerassigned = function (req, res, next) {
     if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
    res.render('managerassigned',{
       title:"管理员测试页面",
       username:req.session.username
    })
}

//老师表
exports.tomanagerteacher = function (req, res, next) {
    if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
if(typeof require !== 'undefined')XLSX=require('xlsx');
var workbook = XLSX.readFile('./public/Excel/teacher.xlsx');
var sheet_name_list = workbook.SheetNames;
var arr=[];
sheet_name_list.forEach(function(sheetname) { /* iterate through sheets */
  var worksheet = workbook.Sheets[sheetname];
  for (z in worksheet) {
    if(z[0] === '!') continue;
       arr.push(JSON.stringify(worksheet[z].v));
       if(z.indexOf('E')==0){
            arr.push(';')
       }
  } 
});
    res.render('managerteacher',{
       title:"管理员测试页面",
       username:req.session.username,
       "excel":arr
    })
}
//学生表
exports.tomanagerstudent = function (req, res, next) {
    if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
if(typeof require !== 'undefined')XLSX=require('xlsx');
var workbook = XLSX.readFile('./public/Excel/student.xlsx');
var sheet_name_list = workbook.SheetNames;
var arr=[];
sheet_name_list.forEach(function(sheetname) { /* iterate through sheets */
  var worksheet = workbook.Sheets[sheetname];
  for (z in worksheet) {
    if(z[0] === '!') continue;
       arr.push(JSON.stringify(worksheet[z].v));
       if(z.indexOf('E')==0){
            arr.push(';')
       }
  } 
});
    res.render('managerstudent',{
       title:"管理员测试页面",
       username:req.session.username,
       "excel":arr
    })
}
//管理员上传老师Excel功能
exports.tmanagerUpload= function (req, res, next) {
              var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../public/Excel");
    form.parse(req, function (err, fields, files) {
        form.keepExtensions = true;
        // form.hash='md5';
        //files.file=form.hash;
         //限制字段域大小
        form.maxFieldsSize = 2 * 1024 * 1024;
    
       // form.maxFilesSize = 0.00002 * 1024 * 1024;
           var oldpath = files.managerteacher.path;
        var extname = path.extname(files.managerteacher.name);
        var newpath = path.normalize(__dirname + "/../public/Excel") + "/teacher"  +extname;
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send("失败");
                return;
            }
           res.redirect('/tomanagerteacher');  
        });
    });
}
//管理员上传学生Excel功能
exports.smanagerUpload= function (req, res, next) {
              var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../public/Excel");
    form.parse(req, function (err, fields, files) {
        form.keepExtensions = true;
        // form.hash='md5';
        //files.file=form.hash;
         //限制字段域大小
        form.maxFieldsSize = 2 * 1024 * 1024;
    
       // form.maxFilesSize = 0.00002 * 1024 * 1024;
           var oldpath = files.managerstudent.path;
        var extname = path.extname(files.managerstudent.name);
        var newpath = path.normalize(__dirname + "/../public/Excel") + "/student"  +extname;
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send("失败");
                return;
            }
           res.redirect('/tomanagerstudent');  
        });
    });
}
//管理员下载excel
exports.tdownload = function (req, res, next) {
    res.download(`./public/Excel/teacher.xlsx`);  
}
exports.sdownload = function (req, res, next) {
    res.download(`./public/Excel/student.xlsx`);  
}
//管理员分配学生老师最终页面
exports.tomanagerLast = function (req, res, next) {
      if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
    res.render('managerLast',{
       title:"管理员测试页面",
       username:req.session.username
    })
}

exports.tomanagerchancepassword = function (req, res, next) {
      if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
    res.render('managerchancepassword',{
       title:"管理员测试页面",
       username:req.session.username
    })
}

exports.tomanagerpending = function (req, res, next) {
      if(req.session.login!=2){
        res.send("请管理员登录再访问")
        return
    }
    res.render('managerpending',{
       title:"管理员测试页面",
       username:req.session.username
    })
}

//管理员修改密码
exports.toMannagerChancePassword = function(req,res,next){
    var form = new formidable.IncomingForm();
 form.parse(req, function (err, fields, files) {
       console.log(fields);
        var username = fields.username;
        var password = md5(fields.PassWord);
       var NewPassWord1 = md5(fields.NewPassWord1);
        var NewPassWord2 = md5(fields.NewPassWord2);
 console.log(NewPassWord1);
  console.log(NewPassWord2);
db.findDocuments("users", {"username": username}, function (err, data) {
     if (err) {
                res.send("-3"); 
                
            }
     if(data.length == 0){
         res.send("-4");
         return;
     }
    if (data[0].password == password && data[0].int ==2 && NewPassWord1 == NewPassWord2) {
                      db.updateDocuments("users", {"username": username}, {
                  "password": NewPassWord1}, function (err, results) {
                })
                 res.send("1");
                    return;
    }
       if(NewPassWord1 != NewPassWord2){
           res.send("-2");
           return;
       }                                                                       
          else{
              res.send("-1");
              return;
          }

})

})
}

 //管理员管理得到老师的数据
exports.managerTeacherSelect = function(req,res){

    db.findDocuments('TeacherSelect',{"status":"审批中"},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
     
        
        
          res.json({"result":result});
    })

}

 //管理员管理审核得到老师的数据审核通过
exports.managerupdateTeacherSelect = function(req,res){
     var time = req.query.time;
    db.updateDocuments("TeacherSelect", {"time": time}, {
                  "status": "审核通过"}, function (err, results) {
                    res.send("1");
                });
                 
}

 //管理员管理审核得到老师的数据审核不通过getAllStudentSelect
exports.managerupdateTeacherSelect1 = function(req,res){
     var time = req.query.time;
    db.updateDocuments("TeacherSelect", {"time": time}, {
                  "status": "审核不通过"}, function (err, results) {
                    res.send("1");
                });
}

 //管理员getAllStudentSelect
exports.getAllStudentSelect = function(req,res){

    db.findDocuments('StudentSelect',{"status":"录取进行中"},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        
          res.json({"result":result});
    })
   
}



 //管理员分配志愿一
exports.getLastStudentSelect1 = function(req,res){
           var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      
        db.insertDocuments('LastStudentSelect',{
            "StudentName":fields.StudentName,
            "TeacherName":fields.TeacherName,
            "ClassName":fields.ClassName,
            "ClassType":fields.ClassType,
            "Volunteer":fields.Volunteer1,
            "status":"录取完成",
            "time":new Date().toLocaleString()
        },function (err, result) {
              

            }
    );
         db.updateDocuments("StudentSelect", {"StudentName":fields.StudentName}, {
                  "status": "录取完成"}, function (err, results) {
                            
                })
       //人数
          db.findDocuments('LastStudentSelect',{"Volunteer":fields.Volunteer1},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
           console.log(result.length)
          res.json({"result":result});
          
    })
         
})       

                       
   
}

 //管理员分配志愿二
exports.getLastStudentSelect2 = function(req,res){
          var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      
        db.insertDocuments('LastStudentSelect',{
            "StudentName":fields.StudentName,
            "TeacherName":fields.TeacherName,
            "ClassName":fields.ClassName,
            "ClassType":fields.ClassType,
            "Volunteer":fields.Volunteer2,
            "status":"录取完成",
            "time":new Date().toLocaleString()
        },function (err, result) {
              

            }
    );
         db.updateDocuments("StudentSelect", {"StudentName":fields.StudentName}, {
                  "status": "录取完成"}, function (err, results) {
                                        
                })
                       //人数
          db.findDocuments('LastStudentSelect',{"Volunteer":fields.Volunteer2},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
           console.log(result.length)
          res.json({"result":result});
          
    })
})
                  
}

 //管理员分配志愿三
exports.getLastStudentSelect3 = function(req,res){
 var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      
        db.insertDocuments('LastStudentSelect',{
            "StudentName":fields.StudentName,
            "TeacherName":fields.TeacherName,
            "ClassName":fields.ClassName,
            "ClassType":fields.ClassType,
            "Volunteer":fields.Volunteer3,
            "status":"录取完成",
            "time":new Date().toLocaleString()
        },function (err, result) {
              

            }
    );
         db.updateDocuments("StudentSelect", {"StudentName":fields.StudentName}, {
                  "status": "录取完成"}, function (err, results) {
                                 
                })
                       //人数
          db.findDocuments('LastStudentSelect',{"Volunteer":fields.Volunteer3},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
           console.log(result.length)
          res.json({"result":result});
          
    })
})
   
}

 //管理员managerLast
exports.managerLast = function(req,res){
    db.findDocuments('LastStudentSelect',{"status":"录取完成"},{sort:{"Volunteer":1}},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }

          res.json({"result":result});
    })
}

 //管理员/managerLastAgain
exports.managerLastAgain = function(req,res){
    var TeacherName = req.query.TeacherName;
    var StudentName = req.query.StudentName;
    var time = req.query.time;
                  db.updateDocuments("StudentSelect", {"TeacherName":TeacherName,"StudentName":StudentName}, {
                  "status": "录取进行中"}, function (err, results) {
                               res.send("1");
                });

                 db.DelDocuments('LastStudentSelect',{"time":time,"StudentName":StudentName},function (err,result) {
                                      
                });

}



//老师测试页面
exports.toteacher = function (req, res, next){
    if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
   else{
        res.render("teacher", {
            "title": "老师测试页面",
            "TeacherName":req.session.username
        });
}
}

//老师公告系统
exports.toteachersystemnotice = function (req, res, next){
    if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
        res.render('teachersystemnotice',{
          title:"老师系统公告",
          TeacherName:req.session.username
      }
      )
}







//老师下载页面tostudentdown
exports.teacherdown = function (req, res, next){
  if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
        res.render('teacherdown',{
          title:"老师下载",
          TeacherName:req.session.username
      }
      )
}

//老师下载学生作品
exports.todown = function(req,res){
            var filename = req.query.filename;
         var downpath = path.normalize(__dirname + "/../StudentUpload")+"/"+filename;
          res.download(downpath);
}

//老师发布上传指导
exports.toteachernotice = function (req, res, next){
      if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
        res.render('teachernotice',{
          title:"老师上传指导",
          TeacherName:req.session.username
      }
      )
}
//老师发布指导书

exports.teacherinsertNotice = function (req, res, next){
          var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      
        db.insertDocuments('gonggao1',{
             Notice1:fields.Notice1,
                 id:fields.id,
             status:"发布成功",
            "time":new Date().toLocaleString()
        },function (err, result) {
                res.send("1");
            
            }
    );
   
})
}

//
exports.LastNotice1 = function (req, res, next){
            db.findDocuments('gonggao1',{"status":"发布成功"},{sort:{"time":-1}},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        
          res.json({"result":result});
    })
}

//删除指导书
exports.delgonggao1 = function (req, res, next){
      var Notice1 = req.query.Notice1;
 db.DelDocuments('gonggao1',{"Notice1":Notice1},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        else{
            
            res.send("1");
        }
        
    })
}
//老师申请命题数据
exports.TeacherSelect = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if( fields.ClassName !="" && fields.ClassType!="")
        {
        db.insertDocuments('TeacherSelect',{
            "ClassName":fields.ClassName,
            "ClassType":fields.ClassType,
            "TeacherName":req.session.username,
            "status":"审批中",
            "time":new Date().toLocaleString()
        },function (err, result) {
            if(err){
                res.send('-1')
            }
            else{
                res.send({ClassName:fields.ClassName});
            }
        })
    }
    else{
        res.send('-1');
    }
    });
}


//老师申请退出选题
exports.tuichuTeacherSelect = function(req,res){
              var time = req.query.time;
 db.DelDocuments('TeacherSelect',{"time":time},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        else{
            res.send("1");
        }
        
    })
}


 //得到老师申请命题数据
exports.getTeacherSelect = function(req,res){
    

    var ClassName = req.query.ClassName;

    db.findDocuments('TeacherSelect',{"TeacherName":req.session.username+""},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        
          res.json({"result":result});
    })

}

//老师最终情况
exports.toteacherLast = function(req,res){
      if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
  res.render("teacherLast", {
            "title": "老师测试页面",
            "TeacherName":req.session.username
        });
}

//老师最终情况data
exports.teacherLast = function(req,res){
   db.findDocuments('LastStudentSelect',{"Volunteer":req.session.username},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        
        res.json({"result":result});
         
    })
}

//老师获得学生详细信息
exports.ThisStudent = function (req, res, next) {
    var StudentName = req.query.StudentName;
     //查找学习详细信息
           db.findDocuments('studentdata',{"check":StudentName},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
           
        res.json({"result":result});
    })


}
//查找学生头像
exports.ThisStudentavator = function (req, res, next) {
    var StudentName = req.query.StudentName;
        //查找学生头像
         db.findDocuments('users',{"username":StudentName},function (err,result2) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
      
           res.json({"result2":result2});
            })
}


//老师留言
exports.teacherliuyan = function (req, res, next) {
      if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
    var username = req.session.username;
      db.findDocuments("users", {username: username}, function (err, result) {
        if (result.length == 0) {
            var avator = "moren.jpg";
        } else {
            var avator = result[0].avator;
        }
        res.render("teacherliuyan", {
            "username": username,
            "TeacherName":req.session.username,
            "active": "首页",
            "avator": avator    //登录人的头像
        });
    });
    
}

//老师修改密码
exports.teacherchancepassword = function(req,res){
      if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
  res.render("teacherchancepassword", {
            "title": "老师测试页面",
            "TeacherName":req.session.username
        });
}
//老师申请命题页面
exports.toteacherselect = function(req,res){
      if(req.session.login!=3){
        res.send("请老师登录再访问")
        return
    }
       res.render("teacherselect", {
            "title": "老师测试页面",
            "TeacherName":req.session.username
        });
  

}



//老师修改密码
exports.toTeacherChancePassword = function(req,res,next){
    var form = new formidable.IncomingForm();
 form.parse(req, function (err, fields, files) {
       console.log(fields);
        var username = fields.username;
        var password = md5(fields.PassWord);
       var NewPassWord1 = md5(fields.NewPassWord1);
        var NewPassWord2 = md5(fields.NewPassWord2);
 console.log(NewPassWord1);
  console.log(NewPassWord2);
db.findDocuments("users", {"username": username}, function (err, data) {
     if (err) {
                res.send("-3"); 
                
            }
     if(data.length == 0){
         res.send("-4");
         return;
     }
    if (data[0].password == password && data[0].int ==3 && NewPassWord1 == NewPassWord2) {
                      db.updateDocuments("users", {"username": username}, {
                  "password": NewPassWord1}, function (err, results) {
                })
                 res.send("1");
                    return;
    }
       if(NewPassWord1 != NewPassWord2){
           res.send("-2");
           return;
       }                                                                       
          else{
              res.send("-1");
              return;
          }

})

})
}



//做登陆
exports.doLogin = function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        console.log(fields);
        var username = fields.username;
        var password = md5(fields.password);
  

        db.findDocuments("users", {"username": username}, function (err, data) {
            if (err) {
                res.send("-3"); 
                return
            }
            if (data.length == 0) {
                res.send("-4");
                return
            }
            if (data[0].password == password && data[0].int ==1) {
                    req.session.login = 1;
                req.session.username = username;
                res.send("1");
                return
            } 
            if (data[0].password == password && data[0].int ==2) {
                    req.session.login = 2;
                req.session.username = username;
                res.send("2");
                return
            } 
            if (data[0].password == password && data[0].int ==3) {
                    req.session.login = 3;
                req.session.username = username;
                res.send("3");
                return
            } 
            else {
                res.send("-1");
            }
        }
        )
    });
}

//注册登录结束
//设置默认头像
exports.showavator = function (req, res, next) {

    res.render('seravator',{
        login: req.session.login,
        username: req.session.username,
        active:'登陆'
    })
}


exports.doavator = function (req, res, next) {
  
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../avatar");
    form.parse(req, function (err, fields, files) {

        var oldpath = files.touxiang.path;
        var newpath = path.normalize(__dirname + "/../avatar") + "/" + req.session.username + ".jpg";
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send("失败");
                return;
            }
            req.session.avator = req.session.username + ".jpg";

            //跳转到切的页面
            res.redirect("/showcut");
        });
    });

}

exports.showcut = function (req, res, next) {
    console.log(req.session.avator);
 
    res.render('cut',{
        login: req.session.login,
        username: req.session.username,
        avator:req.session.avator,
    })
}

exports.docut =function (req,res,next) {
        var filename = req.session.avator;
        var w = req.query.w;
        var h = req.query.h;
        var x = req.query.x;
        var y = req.query.y;
        gm("./avatar/"+filename)
            .crop(w,h,x,y)
            .resize(249,253,"!")
            .write("./avatar/"+filename,function(err){
                if(err){
                    res.send("-1");
                    console.log(err);
                    console.log("./avatar/"+filename);
                    return;
                }

                console.log(req.session.username);
                db.updateDocuments("users", {"username": req.session.username}, {
                  "avator": req.session.avator}, function (err, results) {
                    res.send("剪裁成功！");
                });
            });

}









exports.insertpinglun = function(req,res){
 
    var username = req.session.username;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        db.insertDocuments('neirong',{
            "username" : username,
            "pinglun" : fields.pinglun,
            "time":new Date().toLocaleString()
        },function (err, result) {
            if(err){
                res.send('-1')
            }
            else{
                res.send('1');
            }
        })
    });
}
exports.neirong = function(req,res){

    var page = parseInt(req.query.page);
    db.findDocuments('neirong',{},{sort:{"time":-1},"pageamount":12,"page":page},function (err,result) {
        if(err){
            console.log(3333333);
            console.log(err);
        }
        res.json({"result":result});
    })
}
exports.users = function(req,res){
 
    var use = req.query.use;
    db.findDocuments('users',{"username":use},function (err,result) {
        if(err || result.length == 0){
            res.json("");
            return;
        }
        var obj = {
            "username" : result[0].username,
            "avator" : result[0].avator,
            "_id" : result[0]._id,
        };
        res.json(obj);
      
    })
}
exports.Allcount = function (req,res) {
    db.findAll("neirong",function (req,count) {
        res.send(count.toString())
    })
}






