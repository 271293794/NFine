using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace NFine.Application.SystemManage
{
    class Aa
    {
        public string CreateSql<T>()
        {
            return "Aa类无参泛型方法";
        }
        public string CreateSql<T>(T t)
        {
            return "Aa类单实体方法";
        }
        public string CreateSql<T>(List<T> t)
        {
            //List有2条数据
            string str = TReflection.GetSql<T>(t, this);
            return str;
        }
    }
    class Bb
    {
        public string CreateSql<T>()
        {
            return "Bb类无参泛型方法";
        }
        public string CreateSql<T>(T t)
        {
            return "Bb类单实体方法";
        }
        public string CreateSql<T>(List<T> t)
        {
            string str = TReflection.GetSql<T>(t, this);
            return str;
        }
    }

    class TReflection
    {
        //需要调用类中的单实体方法
        public static string GetSql<T>(List<T> t, Object _class)
        {
            MethodInfo[] pa = _class.GetType().GetMethods();//反射获得所有方法

            MethodInfo pi = null;
            foreach (MethodInfo method in pa)
            {
                if (method.ToString() == "System.String CreateSql[T](T)")//简单粗暴的获取想要的方法的对象
                {
                    pi = method;
                    break;
                }
            }

            /*
             *如果没有此句代码则会抛出：“不能对 ContainsGenericParameters 为 True 的类型或方法执行后期绑定操作。”的异常。
             *原因：因为调用泛型方法，方法自身的类型参数或任何封闭类型中必须不含泛型类型定义或开放构造类型。进行这种递归确认是很困难的。
             *      为方便起见，也为了减少错误，ContainsGenericParameters 属性提供一种标准方法来区分封闭构造方法（可以调用）和开放构造方法（不能调用）。
             *      如果 ContainsGenericParameters 属性返回 true，则方法不能调用。
             *作用：用类型数组的元素代替当前泛型方法定义的类型参数，并返回表示结果构造方法的 MethodInfo 对象。
             */
            pi = pi.MakeGenericMethod(new Type[] { typeof(T) });

            StringBuilder sb = new StringBuilder();
            foreach (T item in t)
            {
                object[] parament = new object[1];//一个参数
                parament[0] = item;
                sb.Append(pi.Invoke(_class, parament)); //调用方法
            }
            return sb.ToString();
        }
    }

}
