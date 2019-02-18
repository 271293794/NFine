using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace MethodInfoInvokeDemo
{
    public class ReflectTest
    {
        public void MethodWithNoParaNoReturn()
        {
            Console.WriteLine("不带参数且不返回值的方法");
        }

        public string MethodWithNoPara()
        {
            Console.WriteLine("不带参数且有返回值的方法");
            return "MethodWithNoPara";
        }

        public string Method1(string str)
        {
            Console.WriteLine("带参数且有返回值的方法");
            return str;
        }

        public string Method2(string str, int index)
        {
            Console.WriteLine("带参数且有返回值的方法");
            return str + index.ToString();
        }

        public string Method3(string str, out string outStr)
        {
            outStr = "bbbb";
            Console.WriteLine("带参数且有返回值的方法");
            return str;
        }

        public static string StaticMethod()
        {
            Console.WriteLine("静态方法");
            return "cccc";
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Type type = typeof(ReflectTest);
            object reflectTest = Activator.CreateInstance(type);

            //不带参数且不返回值的方法的调用
            MethodInfo methodInfo = type.GetMethod("MethodWithNoParaNoReturn");
            methodInfo.Invoke(reflectTest, null);

            Console.WriteLine();

            //不带参数且有返回值的方法的调用
            methodInfo = type.GetMethod("MethodWithNoPara");
            Console.WriteLine(methodInfo.Invoke(reflectTest, null).ToString());

            Console.WriteLine();

            //带参数且有返回值的方法的调用
            methodInfo = type.GetMethod("Method1", new Type[] { typeof(string) });
            Console.WriteLine(methodInfo.Invoke(reflectTest, new object[] { "测试" }).ToString());

            Console.WriteLine();

            //带多个参数且有返回值的方法的调用
            methodInfo = type.GetMethod("Method2", new Type[] { typeof(string), typeof(int) });
            Console.WriteLine(methodInfo.Invoke(reflectTest, new object[] { "测试", 100 }).ToString());

            //Console.WriteLine();

            //methodInfo = type.GetMethod("Method3", new Type[] { typeof(string), typeof(string) });
            //string outStr = "";
            //Console.WriteLine(methodInfo.Invoke(reflectTest, new object[] { "测试", outStr }).ToString());

            Console.WriteLine();

            //静态方法的调用
            methodInfo = type.GetMethod("StaticMethod");
            Console.WriteLine(methodInfo.Invoke(null, null).ToString());

            Console.ReadKey();
        }
    }
}