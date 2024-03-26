using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controller
{
    [ApiController]
    [Route("api/[controller]")] //api/students
    public class StudentsController: ControllerBase
    {
        private readonly AppDbContext _context;
        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Student>> GetStudents(){
            var students = await _context.Students.AsNoTracking().ToListAsync();

            return students;
        }

        [HttpPost] // create
        public async Task<IActionResult> Create(Student student){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            await _context.AddAsync(student);

            var result = await _context.SaveChangesAsync();

            if(result > 0){
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("{id:int}")] // get by id
        public async Task<ActionResult<Student>> GetStudent(int id){

            var student = await _context.Students.FindAsync(id);

            if(student is null)
                return NotFound();

            return Ok(student);
        }

        [HttpDelete("{id:int}")] // delete
        public async Task<IActionResult> Delete(int id){
           var student = await _context.Students.SingleOrDefaultAsync(x=>x.Id==id);

            if(student is null)
            {

                return NotFound();
            }
            _context.Remove(student);

            var result =await _context.SaveChangesAsync();
            if(result > 0){

                return Ok();
            }

            
            return BadRequest("Unable to delted student");
        }

        [HttpPut("{id:int}")] // update
        public async Task<IActionResult> EditStudent(int id, Student student){
            var studentFromDb = await _context.Students.FindAsync(id);

            if(studentFromDb is null){
                return BadRequest("Student not found");
            }

            studentFromDb.Name = student.Name;
            studentFromDb.Adress = student.Adress;
            studentFromDb.Email = student.Email;
            studentFromDb.PhoneNumber = student.PhoneNumber;

            var result = await _context.SaveChangesAsync();

            if(result > 0){
                return Ok();
            }


            return BadRequest();
        }


    }
}