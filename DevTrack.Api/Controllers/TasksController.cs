using DevTrack.Api.Data;
using DevTrack.Api.DTOs.Tasks;
using DevTrack.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(CreateTaskDto dto)
    {
        var project = await _context.Projects.FindAsync(dto.ProjectId);
        if (project == null)
            return BadRequest("Project not found.");

        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest("Task title is required.");

        var taskItem = new TaskItem
        {
            ProjectId = dto.ProjectId,
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            Status = "Todo"
        };

        _context.Tasks.Add(taskItem);
        await _context.SaveChangesAsync();

        return Ok(taskItem);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<TaskItem>> UpdateStatus(int id, UpdateTaskStatusDto dto)
    {
        var taskItem = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        if (taskItem == null)
            return NotFound();

        taskItem.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok(taskItem);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var taskItem = await _context.Tasks.FindAsync(id);
        if (taskItem == null)
            return NotFound();

        _context.Tasks.Remove(taskItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}