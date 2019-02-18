using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NFine.Domain.Utility.Utility
{
    public class ViewField
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public InputType InputType { get; set; }
    }
    public enum InputType
    {
        text=0,
        checkbox=1,
        textarea=2,
        select=3
    }
}
