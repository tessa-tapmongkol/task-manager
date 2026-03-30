using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TodoItemsController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/todoitems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetAll()
    {
        return await _db.TodoItems.ToListAsync();
    }

    // POST: api/todoitems
    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create([FromBody] CreateTodoItemRequest request)
    {
        var item = new TodoItem
        {
            Title = request.Title
        };

        _db.TodoItems.Add(item);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
    }

    // PUT: api/todoitems/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItem>> Update(string id, [FromBody] UpdateTodoItemRequest request)
    {
        var item = await _db.TodoItems.FindAsync(id);
        if (item is null)
        {
            return NotFound();
        }

        if (request.Title is not null)
        {
            item.Title = request.Title;
        }

        if (request.IsCompleted.HasValue)
        {
            item.IsCompleted = request.IsCompleted.Value;
        }

        await _db.SaveChangesAsync();

        return Ok(item);
    }

    // DELETE: api/todoitems/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var item = await _db.TodoItems.FindAsync(id);
        if (item is null)
        {
            return NotFound();
        }

        _db.TodoItems.Remove(item);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}

public class CreateTodoItemRequest
{
    public string Title { get; set; } = string.Empty;
}

public class UpdateTodoItemRequest
{
    public string? Title { get; set; }
    public bool? IsCompleted { get; set; }
}
