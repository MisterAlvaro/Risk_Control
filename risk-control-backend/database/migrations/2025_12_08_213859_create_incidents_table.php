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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->foreignId('trade_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('risk_rule_id')->constrained()->onDelete('cascade');
            $table->json('violation_data');
            $table->enum('status', ['pending', 'processed', 'action_executed'])->default('pending');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['account_id', 'status']);
            $table->index(['risk_rule_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
