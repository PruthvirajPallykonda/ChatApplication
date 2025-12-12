using Microsoft.EntityFrameworkCore;
using chat_backend.Entities;

namespace chat_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users => Set<User>();
        public DbSet<ChatRoom> ChatRooms => Set<ChatRoom>();
        public DbSet<Message> Messages => Set<Message>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);
                entity.HasIndex(u => u.PhoneNumber).IsUnique();
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.PhoneNumber).IsRequired().HasMaxLength(10);

            });

            //chat

            modelBuilder.Entity<ChatRoom>(entity =>
            {
                entity.HasKey(r => r.Id);

                entity.HasOne(r => r.User1)
                      .WithMany(u => u.ChatRoomsAsUser1)
                      .HasForeignKey(r => r.User1Id)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.User2)
                      .WithMany(u => u.ChatRoomsAsUser2)
                      .HasForeignKey(r => r.User2Id)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            //message
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(m => m.Id);

                entity.Property(m => m.Text)
                      .IsRequired()
                      .HasMaxLength(1000);

                entity.HasOne(m => m.Room)
                      .WithMany(r => r.Messages)
                      .HasForeignKey(m => m.RoomId);

                entity.HasOne(m => m.Sender)
                      .WithMany(u => u.Messages)
                      .HasForeignKey(m => m.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);
            });


        }
    }
}
