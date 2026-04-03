namespace DevTrack.Api.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int OwnerId { get; set; }
    public User? Owner { get; set; }

    public List<TaskItem> Tasks { get; set; } = new();
}