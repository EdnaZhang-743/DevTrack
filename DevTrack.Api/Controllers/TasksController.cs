using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DevTrack.Api.Data;
using DevTrack.Api.DTOs.Tasks;
using DevTrack.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                        ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null) return null;

        return int.Parse(userIdClaim);
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

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<TaskItem>> UpdateTask(int id, UpdateTaskDto dto)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null) return Unauthorized();

        var taskItem = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id && t.Project!.OwnerId == currentUserId.Value);

        if (taskItem == null) return NotFound();

        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest("Task title is required.");

        taskItem.Title = dto.Title.Trim();
        taskItem.Description = dto.Description?.Trim();
        taskItem.Priority = dto.Priority;

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