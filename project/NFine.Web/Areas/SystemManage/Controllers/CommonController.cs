using NFine.Application.SystemManage;
using NFine.Code;
using NFine.Domain;
using NFine.Domain.Entity.SystemManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;

namespace NFine.Web.Areas.SystemManage.Controllers
{
    /// <summary>
    /// 公共接口控制器
    /// </summary>
    public class CommonController : ControllerBase
    {
        public object Asser { get; private set; }

        [HttpGet]
        //[HandlerAjaxOnly]
        public ActionResult GetEntityFields(string appName, string entityName)
        {
            // 找出程序集中所有类
            var nameSpaceApp = new String[]
            {
                "NFine.Application.SystemManage",
                "NFine.Application.SystemSecurity"
            };
            var nameSpaceEntity = new String[]
            {
                "NFine.Domain.Entity.SystemManage",
                "NFine.Domain.Entity.SystemSecurity"
            };
            Type appType = Assembly.Load(new AssemblyName("NFine.Application")).GetTypes()
                .Where(type => nameSpaceApp.Contains(type.Namespace) && type.Name == appName).FirstOrDefault();
            //Type appType2 =appType.MakeGenericType(typeof(string));

            Type entityType = Assembly.Load(new AssemblyName("NFine.Domain")).GetTypes()
                .Where(type => nameSpaceEntity.Contains(type.Namespace) && type.Name == entityName).FirstOrDefault();
            try
            {


                MethodInfo methodInfo = appType.GetMethod("KeyValuePairs");
                methodInfo = methodInfo.MakeGenericMethod(new Type[] { entityType });

                object instance = Activator.CreateInstance(appType);
                var fieldTypes = methodInfo.Invoke(instance, new object[] { });
                return Content(fieldTypes.ToJson());
            }
            catch (Exception e)
            {
                return Content(e.ToJson());
            }


        }
    }




}

