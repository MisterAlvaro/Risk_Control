<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['BUY', 'SELL']);
            $table->decimal('volume', 10, 2);
            $table->timestamp('open_time');
            $table->timestamp('close_time')->nullable();
            $table->decimal('open_price', 15, 5);
            $table->decimal('close_price', 15, 5)->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['account_id', 'status']);
            $table->index(['open_time', 'close_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};
