using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class Student
    {
        public int Id { get; set; } [Required]
        
        public string Name { get; set; } = string.Empty;

        public string Adress { get; set; } = string.Empty;

        public int PhoneNumber { get; set; }

        public string Email { get; set; } = string.Empty;


    }
}